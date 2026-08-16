package com.example.furniture.service;
import com.example.furniture.ENUMS.SortOption;
import com.example.furniture.inputDTO.UpdatePricesRequest;
import com.example.furniture.inputDTO.response.PagedResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.furniture.inputDTO.ProductDTO;
import com.example.furniture.model.Image;
import com.example.furniture.model.Product;
import com.example.furniture.model.Rating;
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

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, SupplierRepository supplierRepository, ImageRepository imageRepository, RatingRepository ratingRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.imageRepository = imageRepository;
        this.ratingRepository = ratingRepository;
    }
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    @Value("${file.upload-dir}")
    private String uploadDir;

    // -------------------------<< admin CRUDs >>-------------------------
    public ResponseEntity<?> addProduct(Product product, MultipartFile[] files) {
        try {
            logger.info("Attempting to add new product: {}", product.getName());

            // Validate product fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                logger.warn("Validation failed: Product name is missing");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "اسم المنتج مطلوب"));
            }
            if (product.getCode() == null || product.getCode().trim().isEmpty()) {
                logger.warn("Validation failed: Product code is missing");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "كود المنتج مطلوب"));
            }

            List<Image> imageList = new ArrayList<>();

            // Max file size (2MB) and total request size (10MB)
            long MAX_FILE_SIZE = 2 * 1024 * 1024;   // 2MB
            long MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB

            long totalSize = 0;

            // Handle image upload
            if (files != null && files.length > 0) {
                for (MultipartFile file : files) {
                    if (file != null && !file.isEmpty()) {

                        // Check individual file size
                        if (file.getSize() > MAX_FILE_SIZE) {
                            logger.warn("File {} exceeded max allowed size ({} bytes)", file.getOriginalFilename(), MAX_FILE_SIZE);
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body(Map.of("message", "حجم الملف أكبر من المسموح به (2MB): " + file.getOriginalFilename()));
                        }

                        // Check total request size
                        totalSize += file.getSize();
                        if (totalSize > MAX_REQUEST_SIZE) {
                            logger.warn("Total request size exceeded ({} bytes)", MAX_REQUEST_SIZE);
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
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
                            logger.error("File upload error for product {}: {}", product.getName(), ex.getMessage(), ex);
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body(Map.of("message", "حدث خطأ أثناء رفع الصور"));
                        }
                    }
                }
            }

            product.setImages(imageList);
            productRepository.save(product);
            logger.info("Product added successfully: {}", product.getName());

            return ResponseEntity.ok(Map.of("message", "تمت إضافة المنتج بنجاح"));

        } catch (DataIntegrityViolationException e) {
            logger.error("Duplicate code error while saving product {}: {}", product.getName(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "الكود المدخل مستخدم بالفعل، يرجى إدخال كود مختلف"));

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid argument while adding product {}: {}", product.getName(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "البيانات المدخلة غير صحيحة: " + e.getMessage()));

        } catch (Exception e) {
            logger.error("Unexpected error while saving product {}: {}", product.getName(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ غير متوقع أثناء حفظ المنتج"));
        }
    }

    public ResponseEntity<?> updateProductById(Long id, String name, String code, String description,
                                               double price, double canceledPrice,
                                               Long categoryId, String supplierCode,
                                               boolean freeDelivery, boolean fastDelivery,
                                               MultipartFile[] newImages,
                                               List<Long> deletedImages) {
        try {
            logger.info("Updating product with id: {}", id);
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            // Update fields
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
            // Handle deleted images
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

            // Handle new images
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
                        imageRepository.save(image);

                        logger.info("Added new image: {}", filename);
                    }
                }
            }

            Product updated = productRepository.save(product);
            logger.info("Successfully updated product: {}", updated.getName());
            return ResponseEntity.ok(updated);

        } catch (IllegalArgumentException e) {
            logger.warn("Update failed for product id {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "المنتج أو الفئة غير موجودة"));

        } catch (DataIntegrityViolationException e) {
            logger.error("Update failed due to duplicate code for product id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "الكود المدخل مستخدم بالفعل، يرجى إدخال كود مختلف"));

        } catch (IOException e) {
            logger.error("File handling error while updating product id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ أثناء حفظ أو حذف الصور"));

        } catch (Exception e) {
            logger.error("Unexpected error while updating product id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ غير متوقع أثناء تحديث المنتج"));
        }
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
    @Transactional
    public ProductDTO getProduct(Long id) {
        logger.info("Fetching product with ID: {}", id);
        Optional<Product> optionalProduct = productRepository.findByIdWithImages(id);
        if (optionalProduct.isEmpty()) {
            logger.warn("Product not found with ID: {}", id);
            return null;
        }
        Product product = optionalProduct.get();
        logger.debug("Product fetched: {}", product.getName());
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

    @Transactional
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

    // --------------------<< Unified Get List Query >>---------------------------------------------

    public PagedResponse<ProductDTO> search(int page, int limit, String search,
                                            List<Long> categoryIds, Double minPrice, Double maxPrice,
                                            Double minRating, SortOption sortOption) {
        logger.info("Searching for products: page={}, limit={}, search={}, categoryIds={}, minPrice={}, maxPrice={}, minRating={}, sortOption={}",
                page, limit, search, categoryIds, minPrice, maxPrice, minRating, sortOption);

        Specification<Product> spec = Specification
                .where(ProductSpecifications.hasSearch(search))
                .and(ProductSpecifications.inCategories(categoryIds))
                .and(ProductSpecifications.priceBetween(minPrice, maxPrice))
                .and(ProductSpecifications.minRating(minRating));

        Page<Product> idPage;

        if (sortOption == SortOption.MOST_RATED) {
            // Handled by custom Criteria query that sorts by AVG(rating.stars) DESC
            Pageable pageable = PageRequest.of(Math.max(page - 1, 0), limit);
            idPage = productRepository.findAllOrderByAverageRating(spec, pageable);
        } else {
            Sort sort = switch (sortOption) {
                case PRICE_ASC     -> Sort.by("price").ascending();
                case PRICE_DESC    -> Sort.by("price").descending();
                case BEST_SELLERS  -> Sort.by("quantitySailed").descending();
                case NEWEST        -> Sort.by("id").descending();
                default            -> throw new IllegalStateException("Unexpected sort: " + sortOption);
            };
            Pageable pageable = PageRequest.of(Math.max(page - 1, 0), limit, sort);
            idPage = productRepository.findAll(spec, pageable);
        }

        List<Long> ids = idPage.getContent().stream()
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

        logger.debug("Returning {} of {} total products (page {} of {})",
                result.size(), idPage.getTotalElements(), page, idPage.getTotalPages());

        return new PagedResponse<>(result, idPage.getTotalElements(), idPage.getTotalPages(), page);
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
