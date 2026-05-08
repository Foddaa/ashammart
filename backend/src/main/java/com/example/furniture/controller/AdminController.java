package com.example.furniture.controller;

import com.example.furniture.inputDTO.UpdatePricesRequest;
import com.example.furniture.model.Category;
import com.example.furniture.model.Product;
import com.example.furniture.model.Supplier;
import com.example.furniture.repository.CategoryRepository;
import com.example.furniture.repository.SupplierRepository;
import com.example.furniture.repository.SupplierRequestRepository;
import com.example.furniture.service.CategoryService;
import com.example.furniture.service.ProductService;
import com.example.furniture.service.SiteAssetService;
import com.example.furniture.service.SupplierService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    CategoryService categoryService;
    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    SupplierRepository supplierRepository;
    @Autowired
    SupplierService supplierService;
    @Autowired
    SupplierRequestRepository supplierRequestRepository;
    @GetMapping
    public String admin() {
        return "success";
    }
    @Autowired
    private SiteAssetService assetService;

    @Autowired
    ProductService productService;
    @PatchMapping(value = "/product/{id}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                           @RequestParam("name") String name,
                                           @RequestParam("code") String code,
                                           @RequestParam("description") String description,
                                           @RequestParam("price") double price,
                                           @RequestParam("canceledPrice") double canceledPrice,
                                           @RequestParam("categoryId") Long categoryId,
                                           @RequestParam("supplierCode") String supplierCode,
                                           @RequestParam(value = "images", required = false) MultipartFile[] newImages,
                                           @RequestParam(value = "deletedImages", required = false) String deletedImagesJson) {
        logger.info("Updating product with ID: {}", id);
        try {
            List<Long> deletedImages = new ArrayList<>();
            if (deletedImagesJson != null && !deletedImagesJson.isBlank()) {
                ObjectMapper mapper = new ObjectMapper();
                deletedImages = mapper.readValue(deletedImagesJson, new TypeReference<List<Long>>() {});
                logger.debug("Deleted images IDs: {}", deletedImages);
            }
            ResponseEntity<?> response = productService.updateProductById(
                    id, name, code, description, price,canceledPrice, categoryId,
                    supplierCode, newImages != null ? newImages : new MultipartFile[0],
                    deletedImages
            );
            logger.info("Product updated successfully with ID: {}", id);
            return response;

        } catch (Exception e) {
            logger.error("Error updating product ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }



    @PostMapping("/product/add")
    public ResponseEntity<?> createProduct(@RequestParam String name,
                                           @RequestParam String code,
                                           @RequestParam String description,
                                           @RequestParam double price,
                                           @RequestParam double canceledPrice,
                                           @RequestParam long category,
                                           @RequestParam String supplierCode,
                                           @RequestParam(value = "images", required = false) MultipartFile[] images) {
        try {
            logger.info("Adding product: {}", name);

            Product product = new Product();
            product.setName(name);
            product.setCode(code);
            product.setPrice(price);
            product.setCanceledPrice(canceledPrice);
            product.setDescription(description);

            Category categoryEntity = categoryRepository.findById(category)
                    .orElse(null);
            if (categoryEntity == null) {
                logger.warn("Category not found with id: {}", category);
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "الفئة غير موجودة"));
            }
            product.setCategory(categoryEntity);

            Supplier supplier = supplierRepository.findByCode(supplierCode);
            if (supplier == null) {
                logger.warn("Supplier not found with code: {}", supplierCode);
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "المورد غير موجود"));
            }
            product.setSupplier(supplier);

            return productService.addProduct(product, images);

        } catch (IllegalArgumentException e) {
            logger.warn("Validation failed while adding product: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "خطأ في البيانات المدخلة: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error while adding product: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ غير متوقع أثناء إضافة المنتج"));
        }
    }




    @PostMapping("/category/add")
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        logger.info("Adding category: {}", category.getName());
        return categoryService.addCategory(category);
    }

    @PatchMapping("/category/{id}/update")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        logger.info("Updating category ID: {}", id);
        return categoryService.updateCategory(id, updatedCategory);
    }

    @GetMapping("/category/byId")
    public ResponseEntity<Category> getCategoryById(@RequestParam Long id) {
        logger.info("Fetching category ID: {}", id);
        Category category = categoryService.getCategoryById(id);
        if (category != null) {
            return ResponseEntity.ok(category);
        } else {
            logger.warn("Category not found ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/category/all")
    public List<Category> getAllCategory() {
        logger.info("Fetching all categories");
        return categoryService.getAllCategories();
    }

    @DeleteMapping("/category/delete")
    public ResponseEntity<?> deleteCategory(@RequestParam Long id) {
        logger.warn("Deleting category ID: {}", id);
        try {
            categoryRepository.deleteById(id);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            logger.error("Error deleting category ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body("Delete failed: " + e.getMessage());
        }

    }
    @GetMapping("/supplier/all")
    public List<Supplier> getAllSupplier() {
        logger.info("Fetching all suppliers");
        return supplierService.getAllSuppliers();
    }

    @PostMapping("/supplier/add")
    public ResponseEntity<?> addCSupplier(@RequestBody Supplier supplier) {
        logger.info("Adding supplier: {}", supplier.getName());
        return supplierService.addSupplier(supplier);
    }

    @DeleteMapping("/supplier/delete")
    public ResponseEntity<?> deleteSupplier(@RequestParam Long id) {
        logger.warn("Deleting supplier ID: {}", id);
        try {
            supplierRepository.deleteById(id);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            logger.error("Error deleting supplier ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body("Delete failed: " + e.getMessage());
        }

    }
    @PatchMapping("/supplier/{id}/update")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody Supplier updatedSupplier) {
        logger.info("Updating supplier ID: {}", id);
        return supplierService.updateSupplier(id, updatedSupplier);
    }
    @GetMapping("/supplier/byId")
    public ResponseEntity<Supplier> getSupplierById(@RequestParam Long id) {
        logger.info("Fetching supplier ID: {}", id);
        Supplier supplier = supplierService.getSupplierById(id);
        if (supplier != null) {
            logger.info("supplier :{} found with id: {}",supplier.getName(),id);
            return ResponseEntity.ok(supplier);
        } else {
            logger.warn("Supplier not found ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/supplierRequest/all")
    public ResponseEntity<?> getAllRequests(){
        logger.info("Fetching all supplier requests");
        return supplierService.getAllSuppliersRequests();
    }
    @DeleteMapping("/supplierRequest/delete")
    public ResponseEntity<?> deleteSupplierRequest(@RequestParam Long id) {
        logger.warn("Deleting supplier request ID: {}", id);
        try {
            supplierRequestRepository.deleteById(id);
            logger.info("supplier deleted successfully with id: {}", id);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            logger.error("Error deleting supplier request ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body("Delete failed: " + e.getMessage());
        }

    }

    @PutMapping("/products/updatePrices")
    public ResponseEntity<?> updatePrices(@RequestBody UpdatePricesRequest request){
        logger.info("Bulk price update started: type={}, value={}",
                request.getUpdatePricesType(), request.getValue());
        try {
            int updatedCount = productService.updateAllPrices(request);
            logger.info("Bulk price update completed. Updated {} products", updatedCount);
            return ResponseEntity.ok("updated " + updatedCount + " products successfully");
        }catch (Exception e){
            logger.error("Bulk price update failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }
    @GetMapping("/assets/logo")
    public ResponseEntity<Map<String, String>> getLogoUrl() {
        return ResponseEntity.ok(Map.of("url", assetService.getAssetDataUrl("logo")));
    }

    @GetMapping("/assets/slider")
    public ResponseEntity<Map<String, String>> getSliderUrls() {
        Map<String, String> urls = new HashMap<>();
        urls.put("1", assetService.getAssetDataUrl("slider1"));
        urls.put("2", assetService.getAssetDataUrl("slider2"));
        urls.put("3", assetService.getAssetDataUrl("slider3"));
        return ResponseEntity.ok(urls);
    }

    @GetMapping("/assets/hero-video")
    public ResponseEntity<Map<String, String>> getHeroVideoUrl() {
        return ResponseEntity.ok(Map.of("url", assetService.getAssetDataUrl("heroVideo")));
    }

    @GetMapping("/assets/best-seller")
    public ResponseEntity<Map<String, String>> getBestSellerUrl() {
        return ResponseEntity.ok(Map.of("url", assetService.getAssetDataUrl("bestSeller")));
    }

    @GetMapping("/assets/most-rated")
    public ResponseEntity<Map<String, String>> getMostRatedUrl() {
        return ResponseEntity.ok(Map.of("url", assetService.getAssetDataUrl("mostRated")));
    }

    // NEW: Serve the actual image/video bytes
    @GetMapping("/assets/data/{assetKey}")
    public ResponseEntity<byte[]> getAssetData(@PathVariable String assetKey) {
        byte[] data = assetService.getAssetData(assetKey);
        String mimeType = assetService.getAssetMimeType(assetKey);
        if (data == null || data.length == 0) {
            return ResponseEntity.notFound().build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(mimeType));
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }

    // PUT endpoint remains the same – updates database with new file bytes
    @PutMapping("/update/assets")
    public ResponseEntity<?> updateAssets(
            @RequestParam(value = "logo", required = false) MultipartFile logo,
            @RequestParam(value = "slider1", required = false) MultipartFile slider1,
            @RequestParam(value = "slider2", required = false) MultipartFile slider2,
            @RequestParam(value = "slider3", required = false) MultipartFile slider3,
            @RequestParam(value = "heroVideo", required = false) MultipartFile heroVideo,
            @RequestParam(value = "bestSeller", required = false) MultipartFile bestSeller,
            @RequestParam(value = "mostRated", required = false) MultipartFile mostRated) {

        try {
            if (logo != null) assetService.updateAsset("logo", logo);
            if (slider1 != null) assetService.updateAsset("slider1", slider1);
            if (slider2 != null) assetService.updateAsset("slider2", slider2);
            if (slider3 != null) assetService.updateAsset("slider3", slider3);
            if (heroVideo != null) assetService.updateAsset("heroVideo", heroVideo);
            if (bestSeller != null) assetService.updateAsset("bestSeller", bestSeller);
            if (mostRated != null) assetService.updateAsset("mostRated", mostRated);

            return ResponseEntity.ok().body("Assets updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Update failed: " + e.getMessage());
        }
    }
}