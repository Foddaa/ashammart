package com.example.furniture.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.furniture.inputDTO.ProductDTO;
import com.example.furniture.model.Image;
import com.example.furniture.model.Product;
import com.example.furniture.model.Rating;
import com.example.furniture.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepository;
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    SupplierRepository supplierRepository;

    @Autowired
    ImageRepository imageRepository;
    @Autowired
    RatingRepository ratingRepository;
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Transactional
    public ResponseEntity<?> deleteById(Long id) {
        try {
            logger.info("Deleting product with id: {}", id);
            productRepository.deleteById(id);
            logger.info("Successfully deleted product with id: {}", id);
            return ResponseEntity.ok("تم حذف المنتج");
        } catch (Exception e) {
            logger.error("Error while deleting product with id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "failed: " + e.getMessage()));
        }
    }

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAllWithImagesAndRatings();
        List<ProductDTO> result = products.stream().map(ProductDTO::new).toList();
        return result;
    }

    public void save(Product product) {
        productRepository.save(product);
    }


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

    @Transactional
    public ResponseEntity<?> getByCategoryId(Long id) {
        if (categoryRepository.existsById(id)) {
            List<Product> products = productRepository.findByCategoryIdWithImages(id);
            for (Product p : products) {
                Set<Rating> ratings = ratingRepository.findByProductId(p.getId());
                p.getRatings().addAll(ratings);
            }
            List<ProductDTO> result = products.stream().map(ProductDTO::new).toList();
            return ResponseEntity.ok(result);
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");

    }

    @Transactional
    public ProductDTO getProduct(Long id) {
        Product product = productRepository.findByIdWithImages(id);
        ProductDTO productDto = ProductDTO.withRatings(product);
        return productDto;
    }


    public ResponseEntity<?> updateProductById(Long id, String name, String code, String description,
                                               double price, double canceledPrice,
                                               Long categoryId, String supplierCode,
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
    public List<Product> getProductsContaining(String search) {
        List<Product> searchResult = productRepository.searchProductsByNameOrDescription(search);
        return searchResult;
    }

    @Transactional
    public List<Product> getBestSellers() {
        List<Product> products = productRepository.findTop8ByQuantitySailed();
        for (Product p : products) {
            Set<Rating> ratings = ratingRepository.findByProductId(p.getId());
            p.getRatings().addAll(ratings);
        }
        return products;
    }

    @Transactional
    public List<Product> getMostRated() {
        Map<Long, Product> products = new HashMap<>();
        List<Rating> ratings = ratingRepository.findAll();
        Product product;
        for (Rating r : ratings) {
            if (products.containsKey(r.getProduct().getId())) {
                product = products.get(r.getProduct().getId());
            } else {
                product = productRepository.findByIdWithImages(r.getProduct().getId());
            }
            product.getRatings().add(r);
            products.put(product.getId(), product);
        }
        return products.values().stream().toList();
    }
    @Transactional
    public List<ProductDTO> findAllById(List<Long> ids) {
        System.out.println(ids);
        List<ProductDTO> products = new ArrayList<>();
        for (long id:ids){
            ProductDTO product = getProduct(id);
            products.add(product);
        }
        return products;
    }

}
