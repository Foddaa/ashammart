package com.example.furniture.service;
import com.example.furniture.ENUMS.SortOption;
import com.example.furniture.inputDTO.*;
import com.example.furniture.inputDTO.response.PagedResponse;
import com.example.furniture.inputDTO.response.SkuImageDTO;
import com.example.furniture.inputDTO.response.SkuProductDTO;
import com.example.furniture.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.furniture.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ImageRepository imageRepository;
    private final RatingRepository ratingRepository;

    private final ColorRepository colorRepository;
    private final SizeRepository sizeRepository;
    private final ProductVariantRepository productVariantRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            SupplierRepository supplierRepository,
            ImageRepository imageRepository,
            RatingRepository ratingRepository,
            ColorRepository colorRepository,
            SizeRepository sizeRepository,
            ProductVariantRepository productVariantRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.imageRepository = imageRepository;
        this.ratingRepository = ratingRepository;
        this.colorRepository = colorRepository;
        this.sizeRepository = sizeRepository;
        this.productVariantRepository = productVariantRepository;
    }
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    @Value("${file.upload-dir}")
    private String uploadDir;

    // -------------------------<< admin CRUDs >>-------------------------
    @Transactional
    public ResponseEntity<?> addProduct(Product product, MultipartFile[] files,
                                        List<ProductVariantInputDTO> variantInputs,
                                        List<ColorImageMappingDTO> colorMappings) {
        try {
            logger.info("Attempting to add new product: {}", product.getName());

            // Validate basic fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "اسم المنتج مطلوب"));
            }
            if (product.getCode() == null || product.getCode().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "كود المنتج مطلوب"));
            }

            // --- Image handling (unchanged from your original) ---
            List<Image> imageList = new ArrayList<>();
            long MAX_FILE_SIZE = 2 * 1024 * 1024;
            long MAX_REQUEST_SIZE = 10 * 1024 * 1024;
            long totalSize = 0;

            if (files != null && files.length > 0) {
                for (MultipartFile file : files) {
                    if (file != null && !file.isEmpty()) {
                        if (file.getSize() > MAX_FILE_SIZE) {
                            return ResponseEntity.badRequest()
                                    .body(Map.of("message", "حجم الملف أكبر من المسموح به (2MB): " + file.getOriginalFilename()));
                        }
                        totalSize += file.getSize();
                        if (totalSize > MAX_REQUEST_SIZE) {
                            return ResponseEntity.badRequest()
                                    .body(Map.of("message", "إجمالي حجم الملفات تجاوز الحد الأقصى (10MB)"));
                        }
                        try {
                            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                            Path filePath = Paths.get(uploadDir, filename);
                            Files.createDirectories(filePath.getParent());
                            Files.write(filePath, file.getBytes());
                            Image img = new Image();
                            img.setUrl("/uploads/" + filename);
                            img.setProduct(product);
                            imageList.add(img);
                            logger.info("Saved image: {}", filename);
                        } catch (IOException ex) {
                            logger.error("File upload error: {}", ex.getMessage());
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body(Map.of("message", "حدث خطأ أثناء رفع الصور"));
                        }
                    }
                }
            }
            product.setImages(imageList);

            // --- First save product to get an ID (needed for SKU generation) ---
            product = productRepository.save(product);

            // --- Handle variants ---
            if (variantInputs != null && !variantInputs.isEmpty()) {
                for (ProductVariantInputDTO input : variantInputs) {
                    ProductVariant variant = new ProductVariant();
                    variant.setProduct(product);

                    // Resolve color
                    if (input.getColorId() != null) {
                        Color color = colorRepository.findById(input.getColorId())
                                .orElseThrow(() -> new IllegalArgumentException("Color not found: " + input.getColorId()));
                        variant.setColor(color);
                    }
                    // Resolve size
                    if (input.getSizeId() != null) {
                        Size size = sizeRepository.findById(input.getSizeId())
                                .orElseThrow(() -> new IllegalArgumentException("Size not found: " + input.getSizeId()));
                        variant.setSize(size);
                    }
                    variant.setPrice(input.getPrice());
                    variant.setCanceledPrice(input.getCanceledPrice());
                    variant.setQuantity(input.getQuantity());
                    variant.setSku(generateSku(product, input));
                    // status defaults to AVAILABLE

                    product.getVariants().add(variant);
                }
            }
            if (colorMappings != null && !colorMappings.isEmpty()) {
                // Get the list of images in the order they were uploaded
                imageList = product.getImages(); // order preserved if using List

                for (ColorImageMappingDTO mapping : colorMappings) {
                    Color color = colorRepository.findById(mapping.getColorId())
                            .orElseThrow(() -> new IllegalArgumentException("Color not found: " + mapping.getColorId()));
                    for (Integer index : mapping.getImageIndices()) {
                        if (index >= 0 && index < imageList.size()) {
                            imageList.get(index).setColor(color);
                        } else {
                            logger.warn("Invalid image index {} for color mapping", index);
                        }
                    }
                }
            }

            // --- Save again to persist variants (cascade) ---
            productRepository.save(product);

            logger.info("Product added successfully with {} variants",
                    product.getVariants().size());
            return ResponseEntity.ok(Map.of("message", "تمت إضافة المنتج بنجاح"));

        } catch (DataIntegrityViolationException e) {
            logger.error("Duplicate code or SKU error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "الكود أو SKU مستخدم بالفعل، يرجى إدخال قيم مختلفة"));
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "البيانات المدخلة غير صحيحة: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ غير متوقع أثناء حفظ المنتج"));
        }
    }
    @Transactional
    public ResponseEntity<?> updateProductById(Long id, String name, String code, String description,
                                               double price, double canceledPrice,
                                               Long categoryId, String supplierCode,
                                               boolean freeDelivery, boolean fastDelivery,
                                               MultipartFile[] newImages,
                                               List<Long> deletedImages,
                                               List<ProductVariantInputDTO> variantInputs,
                                               List<ColorImageMappingDTO> colorMappings,
                                               List<ImageColorUpdateDTO> imageColorUpdates) {
        try {
            logger.info("Updating product with id: {}", id);
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            // --- Update basic fields ---
            product.setName(name);
            product.setCode(code);
            product.setDescription(description);
            product.setPrice(price);
            product.setCanceledPrice(canceledPrice);
            product.setCategory(categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Category not found")));
            product.setSupplier(supplierRepository.findByCode(supplierCode));
            product.setFreeDelivery(freeDelivery);
            product.setFastDelivery(fastDelivery);

            // --- Handle deleted images ---
            if (deletedImages != null && !deletedImages.isEmpty()) {
                List<Image> existingImages = imageRepository.findByProduct(product);
                for (Image image : existingImages) {
                    if (deletedImages.contains(image.getId())) {
                        Path path = Paths.get(uploadDir, Paths.get(image.getUrl()).getFileName().toString());
                        Files.deleteIfExists(path);
                        imageRepository.delete(image);
                        logger.info("Deleted image: {}", image.getUrl());
                    }
                }
            }

            // --- Handle new images (store them in a temporary list to assign colors later) ---
            List<Image> newImageList = new ArrayList<>();
            if (newImages != null) {
                for (MultipartFile file : newImages) {
                    if (!file.isEmpty()) {
                        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        Path path = Paths.get(uploadDir, filename);
                        Files.createDirectories(path.getParent());
                        Files.write(path, file.getBytes());
                        Image image = new Image();
                        image.setUrl("/uploads/" + filename);
                        image.setProduct(product);
                        // Save and add to product's images
                        imageRepository.save(image);
                        product.getImages().add(image);
                        newImageList.add(image);
                        logger.info("Added new image: {}", filename);
                    }
                }
            }

            // --- Assign colors to new images using colorMappings ---
            if (colorMappings != null && !colorMappings.isEmpty()) {
                for (ColorImageMappingDTO mapping : colorMappings) {
                    Color color = colorRepository.findById(mapping.getColorId())
                            .orElseThrow(() -> new IllegalArgumentException("Color not found: " + mapping.getColorId()));
                    for (Integer index : mapping.getImageIndices()) {
                        if (index >= 0 && index < newImageList.size()) {
                            newImageList.get(index).setColor(color);
                            imageRepository.save(newImageList.get(index)); // update color
                        } else {
                            logger.warn("Invalid image index {} for color mapping", index);
                        }
                    }
                }
            }

            // --- Update colors of existing images ---
            if (imageColorUpdates != null && !imageColorUpdates.isEmpty()) {
                for (ImageColorUpdateDTO update : imageColorUpdates) {
                    Image image = imageRepository.findById(update.getImageId())
                            .orElseThrow(() -> new IllegalArgumentException("Image not found: " + update.getImageId()));
                    if (update.getColorId() != null) {
                        Color color = colorRepository.findById(update.getColorId())
                                .orElseThrow(() -> new IllegalArgumentException("Color not found: " + update.getColorId()));
                        image.setColor(color);
                    } else {
                        image.setColor(null);
                    }
                    imageRepository.save(image);
                }
            }

            // --- Handle variants (corrected to avoid duplicate adds) ---
            if (variantInputs != null) {
                // Build map of existing variants by id
                Map<Long, ProductVariant> existingMap = product.getVariants().stream()
                        .collect(Collectors.toMap(ProductVariant::getId, v -> v));

                // Collect IDs from incoming list (non‑null)
                Set<Long> incomingIds = variantInputs.stream()
                        .filter(v -> v.getId() != null)
                        .map(ProductVariantInputDTO::getId)
                        .collect(Collectors.toSet());

                // 1. Update existing variants in place, and collect new ones
                List<ProductVariant> newVariants = new ArrayList<>();
                for (ProductVariantInputDTO input : variantInputs) {
                    ProductVariant variant;
                    boolean isNew = false;
                    if (input.getId() != null && existingMap.containsKey(input.getId())) {
                        variant = existingMap.get(input.getId());
                    } else {
                        variant = new ProductVariant();
                        variant.setProduct(product);
                        isNew = true;
                    }

                    // Set color / size (may be null)
                    if (input.getColorId() != null) {
                        Color color = colorRepository.findById(input.getColorId())
                                .orElseThrow(() -> new IllegalArgumentException("Color not found: " + input.getColorId()));
                        variant.setColor(color);
                    } else {
                        variant.setColor(null);
                    }
                    if (input.getSizeId() != null) {
                        Size size = sizeRepository.findById(input.getSizeId())
                                .orElseThrow(() -> new IllegalArgumentException("Size not found: " + input.getSizeId()));
                        variant.setSize(size);
                    } else {
                        variant.setSize(null);
                    }

                    variant.setPrice(input.getPrice());
                    variant.setCanceledPrice(input.getCanceledPrice());
                    variant.setQuantity(input.getQuantity());

                    // If new variant, generate SKU
                    if (isNew) {
                        variant.setSku(generateSku(product, input));
                        newVariants.add(variant);
                    }
                    // If existing, fields are updated in place
                }

                // 2. Remove variants that are not in the incoming list
                product.getVariants().removeIf(v -> !incomingIds.contains(v.getId()));

                // 3. Add the new variants
                product.getVariants().addAll(newVariants);
            }

            // --- Save product (cascade will persist changes) ---
            Product updated = productRepository.save(product);
            logger.info("Successfully updated product: {}", updated.getName());
            return ResponseEntity.ok("Product updated successfully");

        } catch (IllegalArgumentException e) {
            logger.warn("Update failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "المنتج أو الفئة أو اللون/المقاس غير موجود"));
        } catch (DataIntegrityViolationException e) {
            logger.error("Duplicate code or SKU: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "الكود أو SKU مستخدم بالفعل، يرجى إدخال قيم مختلفة"));
        } catch (IOException e) {
            logger.error("File handling error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ أثناء حفظ أو حذف الصور"));
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ غير متوقع أثناء تحديث المنتج"));
        }
    }
    private String generateSku(Product product, ProductVariantInputDTO input) {
        String base = product.getCode();
        String colorPart = (input.getColorId() != null) ? "-C" + input.getColorId() : "";
        String sizePart = (input.getSizeId() != null) ? "-S" + input.getSizeId() : "";
        String sku = base + colorPart + sizePart;

        // Ensure uniqueness – if it already exists, append a suffix
        int counter = 1;
        String candidate = sku;
        while (productVariantRepository.findBySku(candidate).isPresent()) {
            candidate = sku + "-" + counter++;
        }
        return candidate;
    }

    @Transactional
    public int updateAllPrices(UpdatePricesRequest request) {
        logger.info("Starting bulk price update: type={}, value={}",
                request.getUpdatePricesType(), request.getValue());
        if (request.getValue() == 0) {
            logger.warn("Bulk price update failed: value cannot be zero");
            throw new IllegalArgumentException("value cannot be zero");
        }

        int updatedCount = switch (request.getUpdatePricesType()) {
            case PERCENTAGE -> {
                if (request.getValue()>100){
                    logger.warn("Bulk price update failed: value cannot be greater than 100% and the passed value is {}",request.getValue());
                    throw new IllegalArgumentException("value cannot be greater than 100%");
                }
                if (request.getValue()<-100){
                    logger.warn("Bulk price update failed: discount cannot be less than -100% and the passed value is {}",request.getValue());
                    throw new IllegalArgumentException("value cannot be less than 100%");
                }
                logger.debug("Applying percentage update: {}%", request.getValue());
                yield productRepository.updatePricesByPercentage(request.getValue());
            }
            case FIXED -> {
                logger.debug("Applying fixed update: {}", request.getValue());
                yield productRepository.updatePricesByFixed(request.getValue());
            }
            default -> {
                logger.error("Invalid update price type: {}", request.getUpdatePricesType());
                throw new IllegalArgumentException("invalid change Prices Type");
            }
        };
        logger.info("Bulk price update completed. Updated {} products", updatedCount);
        return updatedCount;
    }
    @Transactional
    public ResponseEntity<?> deleteById(Long id) {
        try {
            logger.info("Deleting product with id: {}", id);
            productRepository.updateStatus(id,"DELETED");
            logger.info("Successfully deleted product with id: {}", id);
            return ResponseEntity.ok("تم حذف المنتج");
        } catch (Exception e) {
            logger.error("Error while deleting product with id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "failed: " + e.getMessage()));
        }
    }

    // ---------------------------<< General Queries >>---------------------------
    @Transactional(readOnly = true)
    public ProductDTO getProduct(Long id) {
        logger.info("Fetching product with ID: {}", id);

        Optional<Product> optionalProduct =
                productRepository.findByIdWithImages(id);

        if (optionalProduct.isEmpty()) {
            logger.warn("Product not found with ID: {}", id);
            return null;
        }

        Product product = optionalProduct.get();

        // Load variants separately
        List<ProductVariant> variants =
                productRepository.findByProductIdWithColorAndSize(id);
        for (ProductVariant variant : variants) {
            System.out.println(variant.toString());
        }
        product.setVariants(variants);

        for (ProductVariant variant : product.getVariants()) {
            System.out.println(variant.toString());
        }

        logger.debug("Product fetched: {}, variants={}",
                product.getName(), variants.size());

        ProductDTO productDto = ProductDTO.withRatings(product);

        logger.info("Returning product DTO for ID: {}", id);

        return productDto;
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductDTO> getAllProducts(int page, int limit, String search) {
        logger.info("Fetching products page={} limit={} search={}", page, limit, search);

        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), limit);
        Page<Long> idPage = productRepository.findProductIds(search, pageable);

        List<Long> ids = idPage.getContent();
        List<Product> products = ids.isEmpty()
                ? List.of()
                : productRepository.findByIdsWithImagesAndRatings(ids);

        Map<Long, Product> byId = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));
        List<ProductDTO> result = ids.stream()
                .map(byId::get)
                .filter(Objects::nonNull)
                .map(ProductDTO::new)
                .toList();

        logger.debug("Returning {} of {} total products (page {} of {})",
                result.size(), idPage.getTotalElements(), page, idPage.getTotalPages());

        return new PagedResponse<>(result, idPage.getTotalElements(), idPage.getTotalPages(), page);
    }

    @Transactional
    public PagedResponse<ProductDTO> getByCategoryId(Long categoryId, int page, int limit, String search) {
        logger.info("Fetching products by category ID: {}", categoryId);
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), limit);
        Page<Long> idPage = productRepository.findProductByCategoryIds(categoryId ,search, pageable);

        List<Long> ids = idPage.getContent();
        List<Product> products = ids.isEmpty()
                ? List.of()
                : productRepository.findByIdsWithImagesAndRatings(ids);

        Map<Long, Product> byId = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));
        List<ProductDTO> result = ids.stream()
                .map(byId::get)
                .filter(Objects::nonNull)
                .map(ProductDTO::new)
                .toList();

        logger.debug("Returning {} of {} total products (page {} of {})",
                result.size(), idPage.getTotalElements(), page, idPage.getTotalPages());

        return new PagedResponse<>(result, idPage.getTotalElements(), idPage.getTotalPages(), page);
    }

    @Transactional
    public List<Product> getProductsContaining(String search) {
        List<Product> searchResult = productRepository.searchProductsByNameOrDescription(search);
        return searchResult;
    }

    @Transactional
    public PagedResponse<ProductDTO> getBestSellers(int page, int limit) {
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), limit);
        Page<Long> idPage = productRepository.findBestSellersIds(pageable);
        List<Long> ids = idPage.getContent();
        List<Product> products = ids.isEmpty()
                ? List.of()
                : productRepository.findByIdsWithImagesAndRatings(ids);
        Map<Long, Product> byId = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));
        List<ProductDTO> result = ids.stream()
                .map(byId::get)
                .filter(Objects::nonNull)
                .map(ProductDTO::new)
                .toList();

        logger.debug("Returning {} of {} total products (page {} of {})",
                result.size(), idPage.getTotalElements(), page, idPage.getTotalPages());

        return new PagedResponse<>(result, idPage.getTotalElements(), idPage.getTotalPages(), page);
    }

    @Transactional
    public PagedResponse<ProductDTO> getNewArrivals(int page, int limit){
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), limit);
        Page<Long> idPage = productRepository.findNewArrivalIds(pageable);

        List<Long> ids = idPage.getContent();
        List<Product> products = ids.isEmpty()
                ? List.of()
                : productRepository.findByIdsWithImagesAndRatings(ids);

        Map<Long, Product> byId = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));
        List<ProductDTO> result = ids.stream()
                .map(byId::get)
                .filter(Objects::nonNull)
                .map(ProductDTO::new)
                .toList();

        logger.debug("Returning {} of {} total products (page {} of {})",
                result.size(), idPage.getTotalElements(), page, idPage.getTotalPages());

        return new PagedResponse<>(result, idPage.getTotalElements(), idPage.getTotalPages(), page);
    }

    @Transactional
    public PagedResponse<ProductDTO> getMostRated(int page, int limit) {
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), limit);
        Page<Long> idPage = productRepository.findMostRatedIds(pageable);

        List<Long> ids = idPage.getContent();
        List<Product> products = ids.isEmpty()
                ? List.of()
                : productRepository.findByIdsWithImagesAndRatings(ids);

        Map<Long, Product> byId = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        List<ProductDTO> result = ids.stream()
                .map(byId::get)
                .filter(Objects::nonNull)
                .map(ProductDTO::new)
                .toList();

        logger.debug("Returning {} of {} total products (page {} of {})",
                result.size(), idPage.getTotalElements(), page, idPage.getTotalPages());

        return new PagedResponse<>(result, idPage.getTotalElements(), idPage.getTotalPages(), page);
    }

    @Transactional
    public List<Product> getFastDelivery() {
        List<Product> products = productRepository.findFastDelivery();
        for (Product p : products) {
            Set<Rating> ratings = ratingRepository.findByProductId(p.getId());
            p.getRatings().addAll(ratings);
        }
        return products;
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> findAllByIdList(List<Long> ids) {
        List<ProductDTO> products = new ArrayList<>();
        for (long id:ids){
            ProductDTO product = getProduct(id);
            if (product==null){
                continue;
            }
            products.add(product);
        }
        return products;
    }

    @Transactional(readOnly = true)
    public List<SkuProductDTO> getProductsBySkus(List<String> skus) {
        logger.info("Fetching products by SKUs: {}", skus);

        if (skus == null || skus.isEmpty()) {
            return Collections.emptyList();
        }

        List<ProductVariant> variants = productVariantRepository.findBySkuInWithDetails(skus);

        return variants.stream().map(variant -> {
            Product product = variant.getProduct();
            SkuProductDTO dto = new SkuProductDTO();

            dto.setSku(variant.getSku());
            dto.setProductId(product.getId());
            dto.setName(product.getName());
            dto.setCode(product.getCode());
            dto.setPrice(variant.getEffectivePrice());
            dto.setCanceledPrice(variant.getEffectiveCanceledPrice());

            List<SkuImageDTO> imageDtos = product.getImages().stream()
                    .limit(1) // <--- Added this line
                    .map(img -> new SkuImageDTO(img.getUrl()))
                    .collect(Collectors.toList());
            dto.setImages(imageDtos);

            dto.setColorName(variant.getColor() != null ? variant.getColor().getName() : null);
            dto.setSizeName(variant.getSize() != null ? variant.getSize().getName() : null);
            dto.setQuantity(variant.getQuantity());
            dto.setStatus(variant.getStatus());

            return dto;
        }).collect(Collectors.toList());
    }
    // --------------------<< Unified Get List Query >>---------------------------------------------
    @Transactional(readOnly = true)
    public PagedResponse<ProductDTO> search(
            int page,
            int limit,
            String search,
            List<Long> categoryIds,
            Double minPrice,
            Double maxPrice,
            Double minRating,
            SortOption sortOption) {

        logger.info(
                "Searching for products: page={}, limit={}, search={}, categoryIds={}, minPrice={}, maxPrice={}, minRating={}, sortOption={}",
                page, limit, search, categoryIds, minPrice, maxPrice, minRating, sortOption
        );

        Specification<Product> spec = Specification
                .where(ProductSpecifications.hasSearch(search))
                .and(ProductSpecifications.inCategories(categoryIds))
                .and(ProductSpecifications.priceBetween(minPrice, maxPrice))
                .and(ProductSpecifications.minRating(minRating));

        Page<Product> idPage;

        if (sortOption == SortOption.MOST_RATED) {

            Pageable pageable =
                    PageRequest.of(Math.max(page - 1, 0), limit);

            idPage = productRepository.findAllOrderByAverageRating(
                    spec,
                    pageable
            );

        } else {

            Sort sort = switch (sortOption) {
                case PRICE_ASC ->
                        Sort.by("price").ascending();

                case PRICE_DESC ->
                        Sort.by("price").descending();

                case BEST_SELLERS ->
                        Sort.by("quantitySailed").descending();

                case NEWEST ->
                        Sort.by("id").descending();

                default ->
                        throw new IllegalStateException(
                                "Unexpected sort: " + sortOption
                        );
            };

            Pageable pageable =
                    PageRequest.of(
                            Math.max(page - 1, 0),
                            limit,
                            sort
                    );

            idPage = productRepository.findAll(spec, pageable);
        }

        List<Long> ids = idPage.getContent()
                .stream()
                .map(Product::getId)
                .toList();

        List<Product> products = ids.isEmpty()
                ? List.of()
                : productRepository.findByIdsWithImagesAndRatings(ids);

        Map<Long, Product> byId = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        List<ProductDTO> result = ids.stream()
                .map(byId::get)
                .filter(Objects::nonNull)
                .map(ProductDTO::new)
                .toList();

        logger.debug(
                "Returning {} of {} total products (page {} of {})",
                result.size(),
                idPage.getTotalElements(),
                page,
                idPage.getTotalPages()
        );

        return new PagedResponse<>(
                result,
                idPage.getTotalElements(),
                idPage.getTotalPages(),
                page
        );
    }


    // --------------------<< facebook feed functions >>---------------------------------------------
    private String sanitizeForXml(String input) {
        if (input == null) return "";

        String escaped = input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");

        return escaped.replaceAll(
                "[^\\x09\\x0A\\x0D\\x20-\\uD7FF\\uE000-\\uFFFD]",
                ""
        );
    }

    private String escapeCdata(String input) {
        if (input == null) return "";
        // Prevent premature CDATA termination
        return input.replace("]]>", "]]&gt;");
    }

    @Cacheable(value = "facebookFeed")
    @Transactional
    public String getFacebookFeed(){
        List<Product> products = productRepository.findAll();
        StringBuilder xml = new StringBuilder();

        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        xml.append("<rss version=\"2.0\" xmlns:g=\"http://base.google.com/ns/1.0\">");
        xml.append("<channel>");
        xml.append("<title>Anttikka Product Feed</title>");
        xml.append("<link>https://anttikka.com</link>");
        xml.append("<description>Anttikka Furniture Catalog</description>");

        for (Product p : products) {
            // Skip products with no images entirely — don't emit a broken item
            if (p.getImages() == null || p.getImages().isEmpty()) {
                continue;
            }

            xml.append("<item>");

            xml.append("<id>").append(p.getId()).append("</id>");


            // Use CDATA to avoid all entity-related errors in titles/descriptions
            xml.append("<title><![CDATA[").append(escapeCdata(p.getName())).append("]]></title>");
            xml.append("<description><![CDATA[").append(escapeCdata(p.getDescription())).append("]]></description>");

            xml.append("<link>https://anttikka.com/product/").append(p.getId()).append("</link>");

            xml.append("<g:image_link>")
                    .append(sanitizeForXml("https://anttikka.com/api" + p.getImages().get(0).getUrl()))
                    .append("</g:image_link>");


            if (p.getCanceledPrice() != 0 && p.getCanceledPrice() > p.getPrice()) {
                xml.append("<g:price>")
                        .append(String.format("%.2f", p.getCanceledPrice()))
                        .append(" EGP</g:price>");
                xml.append("<g:sale_price>")
                        .append(String.format("%.2f", p.getPrice()))
                        .append(" EGP</g:sale_price>");
            } else {
                xml.append("<g:price>")
                        .append(String.format("%.2f", p.getPrice()))
                        .append(" EGP</g:price>");
            }
            xml.append("<g:availability>in stock</g:availability>");
            xml.append("<g:condition>new</g:condition>");

            xml.append("<g:brand>Anttikka</g:brand>");
            xml.append("<g:google_product_category>436</g:google_product_category>"); // Furniture category

            List<?> images = p.getImages();
            for (int i = 1; i < Math.min(images.size(), 10); i++) {
                xml.append("<g:additional_image_link>")
                        .append(sanitizeForXml("https://anttikka.com/api" + p.getImages().get(i).getUrl()))
                        .append("</g:additional_image_link>");
            }

            xml.append("</item>");
        }

        xml.append("</channel></rss>");

        return xml.toString();
    }
}
