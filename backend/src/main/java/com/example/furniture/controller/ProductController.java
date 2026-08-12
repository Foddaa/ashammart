package com.example.furniture.controller;

import com.example.furniture.inputDTO.ProductDTO;
import com.example.furniture.inputDTO.response.PagedResponse;
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
    public PagedResponse<ProductDTO> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search) {
        return productService.getAllProducts(page, limit, search);
    }

    @GetMapping("/byCategory")
        public PagedResponse<ProductDTO> getByCategory(
                @RequestParam Long categoryId,
                @RequestParam(defaultValue = "1") int page,
                @RequestParam(defaultValue = "10") int limit,
                @RequestParam(required = false) String search) {
        return productService.getByCategoryId(categoryId, page, limit, search);
    }
    @GetMapping(value = "/feed/facebook", produces = "application/xml")
    public String getFacebookFeed() {
        return productService.getFacebookFeed();
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
    public List<ProductDTO> getProductsByIds(@RequestBody List<Long> idList) {
        return productService.findAllByIdList(idList);
    }

    @GetMapping("/fastDelivery")
    public List<ProductDTO> getFastDelivery(){
        System.out.println("fast delivery list requested");
        List<Product> products = productService.getFastDelivery();
        return products.stream().map(ProductDTO::toDto)
                .collect(Collectors.toList());
    }



}

