package com.example.furniture.controller;

import com.example.furniture.inputDTO.ProductDTO;
import com.example.furniture.model.Product;
import com.example.furniture.repository.CategoryRepository;
import com.example.furniture.repository.SupplierRepository;
import com.example.furniture.service.ProductService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    ProductService productService;
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    SupplierRepository supplierRepository;

    @GetMapping("/all")
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/byCategory")
        public ResponseEntity<?> getByCategory(@RequestParam Long categoryId){
        return productService.getByCategoryId(categoryId);
    }

    @GetMapping("/search")
    public List<Product> searchProductsContaining(@RequestParam String search) {
        return productService.getProductsContaining(search);
    }
    @GetMapping("/bestSellers")
    public List<ProductDTO> getBestSellers(){
        List<Product> products = productService.getBestSellers();
        return products.stream().map(ProductDTO::toDto)
                .collect(Collectors.toList());
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam Long id){
        return productService.deleteById(id);
    }
    @GetMapping("/byId")
    public ResponseEntity<?> getById(@RequestParam Long id){
        ProductDTO product=productService.getProduct(id);
        return ResponseEntity.ok(product);
    }
    @GetMapping("/mostRated")
    public List<ProductDTO> getMostRated(){
        List<Product> products = productService.getMostRated();
        List<ProductDTO> res=products.stream().map(ProductDTO::toDto)
                .sorted(Comparator.comparingDouble(ProductDTO::getAverageRating).reversed())
                .limit(8)
                .collect(Collectors.toList());
        return res;
    }
    @PostMapping("/by-ids")
    public List<ProductDTO> getProductsByIds(@RequestBody List<Long> ids) {
        return productService.findAllById(ids);
    }





}

