package com.example.furniture.controller;

import com.example.furniture.model.Category;
import com.example.furniture.model.Product;
import com.example.furniture.model.Supplier;
import com.example.furniture.repository.CategoryRepository;
import com.example.furniture.repository.SupplierRepository;
import com.example.furniture.repository.SupplierRequestRepository;
import com.example.furniture.service.CategoryService;
import com.example.furniture.service.ProductService;
import com.example.furniture.service.SupplierService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
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
    ProductService productService;
    Logger logger = LoggerFactory.getLogger(AdminController.class);

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
        try {
            List<Long> deletedImages = new ArrayList<>();
            if (deletedImagesJson != null && !deletedImagesJson.isBlank()) {
                ObjectMapper mapper = new ObjectMapper();
                deletedImages = mapper.readValue(deletedImagesJson, new TypeReference<List<Long>>() {});
            }
            return productService.updateProductById(
                    id, name, code, description, price,canceledPrice, categoryId,
                    supplierCode, newImages != null ? newImages : new MultipartFile[0],
                    deletedImages
            );
        } catch (Exception e) {
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
        return categoryService.addCategory(category);
    }

    @PatchMapping("/category/{id}/update")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        return categoryService.updateCategory(id, updatedCategory);
    }

    @GetMapping("/category/byId")
    public ResponseEntity<Category> getCategoryById(@RequestParam Long id) {
        Category category = categoryService.getCategoryById(id);

        if (category != null) {
            return ResponseEntity.ok(category);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/category/all")
    public List<Category> getAllCategory() {
        return categoryService.getAllCategories();
    }

    @DeleteMapping("/category/delete")
    public ResponseEntity<?> deleteCategory(@RequestParam Long id) {
        try {
            categoryRepository.deleteById(id);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Delete failed: " + e.getMessage());
        }

    }
    @GetMapping("/supplier/all")
    public List<Supplier> getAllSupplier() {
        return supplierService.getAllSuppliers();
    }

    @PostMapping("/supplier/add")
    public ResponseEntity<?> addCSupplier(@RequestBody Supplier supplier) {
        return supplierService.addSupplier(supplier);
    }

    @DeleteMapping("/supplier/delete")
    public ResponseEntity<?> deleteSupplier(@RequestParam Long id) {
        try {
            supplierRepository.deleteById(id);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Delete failed: " + e.getMessage());
        }

    }
    @PatchMapping("/supplier/{id}/update")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody Supplier updatedSupplier) {
        return supplierService.updateSupplier(id, updatedSupplier);
    }
    @GetMapping("/supplier/byId")
    public ResponseEntity<Supplier> getSupplierById(@RequestParam Long id) {
        Supplier supplier = supplierService.getSupplierById(id);
        if (supplier != null) {
            return ResponseEntity.ok(supplier);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/supplierRequest/all")
    public ResponseEntity<?> getAllRequests(){
        return supplierService.getAllSuppliersRequests();
    }
    @DeleteMapping("/supplierRequest/delete")
    public ResponseEntity<?> deleteSupplierRequest(@RequestParam Long id) {
        try {
            supplierRequestRepository.deleteById(id);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Delete failed: " + e.getMessage());
        }

    }


}
