package com.example.furniture.controller;

import com.example.furniture.inputDTO.RealLifePhotoDTO;
import com.example.furniture.inputDTO.UpdatePricesRequest;
import com.example.furniture.model.*;
import com.example.furniture.repository.*;
import com.example.furniture.service.*;
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
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
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

    @Autowired
    DeliveryPriceRepository deliveryPriceRepository;
    @GetMapping
    public String admin() {
        return "success";
    }
    @Autowired
    private SiteAssetService assetService;

    @Autowired
    ProductService productService;

    @Autowired
    private RealLifePhotoRepository realLifePhotoRepository;

    @Autowired
    private RealLifePhotoStorageService realLifePhotoStorageService;
    @PatchMapping(value = "/product/{id}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                           @RequestParam("name") String name,
                                           @RequestParam("code") String code,
                                           @RequestParam("description") String description,
                                           @RequestParam("price") double price,
                                           @RequestParam("canceledPrice") double canceledPrice,
                                           @RequestParam("categoryId") Long categoryId,
                                           @RequestParam("supplierCode") String supplierCode,
                                           @RequestParam("freeDelivery") boolean freeDelivery,
                                           @RequestParam("fastDelivery") boolean fastDelivery,
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
                    supplierCode, freeDelivery, fastDelivery, newImages != null ? newImages : new MultipartFile[0],
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
                                           @RequestParam("freeDelivery") boolean freeDelivery,
                                           @RequestParam("fastDelivery") boolean fastDelivery,
                                           @RequestParam(value = "images", required = false) MultipartFile[] images) {
        try {
            logger.info("new product request, name: {}, code: {}, description: {}, price: {}, canceledPrice: {}, category: {}, supplierCode: {}, images: {}", name, code, description, price, canceledPrice, category, supplierCode, images);

            Product product = new Product();
            product.setName(name);
            product.setCode(code);
            product.setPrice(price);
            product.setCanceledPrice(canceledPrice);
            product.setDescription(description);
            product.setFreeDelivery(freeDelivery);
            product.setFastDelivery(fastDelivery);
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
    @GetMapping("/assets/fastDelivery")
    public ResponseEntity<Map<String, String>> getFastDeliveryUrl() {
        return ResponseEntity.ok(Map.of("url", assetService.getAssetDataUrl("fastDelivery")));
    }

    @GetMapping("/assets/realLifePhotos")
    public ResponseEntity<Map<String, String>> getRealLifePhotosUrl() {
        return ResponseEntity.ok(Map.of("url", assetService.getAssetDataUrl("realLifePhotos")));
    }

    @GetMapping("/assets/slider")
    public ResponseEntity<Map<String, String>> getSliderUrls() {
        Map<String, String> urls = new HashMap<>();
        urls.put("1", assetService.getAssetDataUrl("slider1"));
        urls.put("2", assetService.getAssetDataUrl("slider2"));
        urls.put("3", assetService.getAssetDataUrl("slider3"));
        urls.put("4", assetService.getAssetDataUrl("slider4"));
        urls.put("5", assetService.getAssetDataUrl("slider5"));
        urls.put("6", assetService.getAssetDataUrl("slider6"));
        urls.put("7", assetService.getAssetDataUrl("slider7"));
        urls.put("8", assetService.getAssetDataUrl("slider8"));
        urls.put("9", assetService.getAssetDataUrl("slider9"));
        urls.put("10", assetService.getAssetDataUrl("slider10"));
        urls.put("11", assetService.getAssetDataUrl("slider11"));
        urls.put("12", assetService.getAssetDataUrl("slider12"));
        urls.put("13", assetService.getAssetDataUrl("slider13"));
        urls.put("14", assetService.getAssetDataUrl("slider14"));
        urls.put("15", assetService.getAssetDataUrl("slider15"));
        urls.put("16", assetService.getAssetDataUrl("slider16"));
        urls.put("17", assetService.getAssetDataUrl("slider17"));
        urls.put("18", assetService.getAssetDataUrl("slider18"));
        urls.put("19", assetService.getAssetDataUrl("slider19"));
        urls.put("20", assetService.getAssetDataUrl("slider20"));

        return ResponseEntity.ok(urls);
    }

    @GetMapping("/assets/hero-video")
    public ResponseEntity<Map<String, String>> getHeroVideoUrl() {
        return ResponseEntity.ok(Map.of("url", assetService.getAssetDataUrl("heroVideo")));
    }

    @GetMapping("/assets/best-seller")
    public ResponseEntity<Map<String, String>> getBestSellerUrl() {
        Map<String, String> urls = new HashMap<>();
        urls.put("1", assetService.getAssetDataUrl("bestSeller1"));
        urls.put("2", assetService.getAssetDataUrl("bestSeller2"));
        urls.put("3", assetService.getAssetDataUrl("bestSeller3"));

        return ResponseEntity.ok(urls);
    }

    @GetMapping("/assets/most-rated")
    public ResponseEntity<Map<String, String>> getMostRatedUrl() {
        Map<String, String> urls = new HashMap<>();
        urls.put("1", assetService.getAssetDataUrl("mostRated1"));
        urls.put("2", assetService.getAssetDataUrl("mostRated2"));
        urls.put("3", assetService.getAssetDataUrl("mostRated3"));

        return ResponseEntity.ok(urls);
    }

    @GetMapping("/assets/homeCategory")
    public ResponseEntity<Map<String, String>> getHomeCategoryUrl() {
        Map<String, String> urls = new HashMap<>();
        urls.put("1", assetService.getAssetDataUrl("fastDelivery"));
        urls.put("2", assetService.getAssetDataUrl("realLifePhotos"));

        return ResponseEntity.ok(urls);
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
            @RequestParam(value = "slider4", required = false) MultipartFile slider4,
            @RequestParam(value = "slider5", required = false) MultipartFile slider5,
            @RequestParam(value = "slider6", required = false) MultipartFile slider6,
            @RequestParam(value = "slider7", required = false) MultipartFile slider7,
            @RequestParam(value = "slider8", required = false) MultipartFile slider8,
            @RequestParam(value = "slider9", required = false) MultipartFile slider9,
            @RequestParam(value = "slider10", required = false) MultipartFile slider10,
            @RequestParam(value = "slider11", required = false) MultipartFile slider11,
            @RequestParam(value = "slider12", required = false) MultipartFile slider12,
            @RequestParam(value = "slider13", required = false) MultipartFile slider13,
            @RequestParam(value = "slider14", required = false) MultipartFile slider14,
            @RequestParam(value = "slider15", required = false) MultipartFile slider15,
            @RequestParam(value = "slider16", required = false) MultipartFile slider16,
            @RequestParam(value = "slider17", required = false) MultipartFile slider17,
            @RequestParam(value = "slider18", required = false) MultipartFile slider18,
            @RequestParam(value = "slider19", required = false) MultipartFile slider19,
            @RequestParam(value = "slider20", required = false) MultipartFile slider20,
            @RequestParam(value = "heroVideo", required = false) MultipartFile heroVideo,
            @RequestParam(value = "bestSeller1", required = false) MultipartFile bestSeller1,
            @RequestParam(value = "bestSeller2", required = false) MultipartFile bestSeller2,
            @RequestParam(value = "bestSeller3", required = false) MultipartFile bestSeller3,
            @RequestParam(value = "mostRated1", required = false) MultipartFile mostRated1,
            @RequestParam(value = "mostRated2", required = false) MultipartFile mostRated2,
            @RequestParam(value = "mostRated3", required = false) MultipartFile mostRated3,
            @RequestParam(value = "fastDelivery", required = false) MultipartFile fastDelivery,
            @RequestParam(value = "realLifePhotos", required = false) MultipartFile realLifePhotos

        ) {

        try {
            if (logo != null) assetService.updateAsset("logo", logo);
            if (slider1 != null) assetService.updateAsset("slider1", slider1);
            if (slider2 != null) assetService.updateAsset("slider2", slider2);
            if (slider3 != null) assetService.updateAsset("slider3", slider3);
            if (slider4 != null) assetService.updateAsset("slider4", slider4);
            if (slider5 != null) assetService.updateAsset("slider5", slider5);
            if (slider6 != null) assetService.updateAsset("slider6", slider6);
            if (slider7 != null) assetService.updateAsset("slider7", slider7);
            if (slider8 != null) assetService.updateAsset("slider8", slider8);
            if (slider9 != null) assetService.updateAsset("slider9", slider9);
            if (slider10 != null) assetService.updateAsset("slider10", slider10);
            if (slider11 != null) assetService.updateAsset("slider11", slider11);
            if (slider12 != null) assetService.updateAsset("slider12", slider12);
            if (slider13 != null) assetService.updateAsset("slider13", slider13);
            if (slider14 != null) assetService.updateAsset("slider14", slider14);
            if (slider15 != null) assetService.updateAsset("slider15", slider15);
            if (slider16 != null) assetService.updateAsset("slider16", slider16);
            if (slider17 != null) assetService.updateAsset("slider17", slider17);
            if (slider18 != null) assetService.updateAsset("slider18", slider18);
            if (slider19 != null) assetService.updateAsset("slider19", slider19);
            if (slider20 != null) assetService.updateAsset("slider20", slider20);
            if (heroVideo != null) assetService.updateAsset("heroVideo", heroVideo);
            if (bestSeller1 != null) assetService.updateAsset("bestSeller1", bestSeller1);
            if (bestSeller2 != null) assetService.updateAsset("bestSeller2", bestSeller2);
            if (bestSeller3 != null) assetService.updateAsset("bestSeller3", bestSeller3);
            if (mostRated1 != null) assetService.updateAsset("mostRated1", mostRated1);
            if (mostRated2 != null) assetService.updateAsset("mostRated2", mostRated2);
            if (mostRated3 != null) assetService.updateAsset("mostRated3", mostRated3);
            if (fastDelivery != null) assetService.updateAsset("fastDelivery", fastDelivery);
            if (realLifePhotos != null) assetService.updateAsset("realLifePhotos", realLifePhotos);

            return ResponseEntity.ok().body("Assets updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Update failed: " + e.getMessage());
        }
    }
    @GetMapping("/delivery/prices")
    public ResponseEntity<?> getDeliveryPrices() {
        List<DeliveryPrice> deliveryPrices = deliveryPriceRepository.findAll();
        return ResponseEntity.ok(deliveryPrices);
    }
    @PutMapping("/delivery/prices/update")
    public ResponseEntity<?> updateDeliveryPrices(@RequestBody List<DeliveryPrice> deliveryPrices) {
        try {
            deliveryPriceRepository.saveAll(deliveryPrices);
            return ResponseEntity.ok("Delivery prices updated successfully");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    // real life images handling
    @PostMapping(value = "/real-life-photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RealLifePhotoDTO> upload(@RequestParam("file") MultipartFile file) throws IOException {
        String fileName = realLifePhotoStorageService.store(file);
        String url = "/api/uploads/real-life-photos/" + fileName;

        RealLifePhoto photo = new RealLifePhoto();
        photo.setFileName(fileName);
        photo.setUrl(url);
        realLifePhotoRepository.save(photo);

        return ResponseEntity.ok(new RealLifePhotoDTO(photo.getId(), photo.getUrl()));
    }

    @DeleteMapping("/real-life-photos/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws IOException {
        RealLifePhoto photo = realLifePhotoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        realLifePhotoStorageService.delete(photo.getFileName());
        realLifePhotoRepository.delete(photo);
        return ResponseEntity.noContent().build();
    }
}