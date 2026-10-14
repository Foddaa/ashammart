package com.example.furniture.controller;

import com.example.furniture.ENUMS.Gender;
import com.example.furniture.ENUMS.SortOption;
import com.example.furniture.inputDTO.ProductDTO;
import com.example.furniture.inputDTO.response.PagedResponse;
import com.example.furniture.inputDTO.response.SkuProductDTO;
import com.example.furniture.model.Product;
import com.example.furniture.repository.CategoryRepository;
import com.example.furniture.repository.SupplierRepository;
import com.example.furniture.service.ClientService;
import com.example.furniture.service.ProductService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @Autowired
    ClientService clientService;

    @GetMapping("/all")
    public PagedResponse<?> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search) {
        return productService.getAllProducts(page, limit, search);
    }

    @GetMapping("/byCategory")
        public PagedResponse<?> getByCategory(
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

    @GetMapping("/byId")
    public ResponseEntity<?> getById(@RequestParam Long id){
        ProductDTO product=productService.getProduct(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/bestSellers")
    public PagedResponse<?> getBestSellers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ){
        return productService.getBestSellers(page, limit);
    }
    @GetMapping("/mostRated")
    public  PagedResponse<?> getMostRated(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ){
        return productService.getMostRated(page, limit);
    }

    @GetMapping("/newArrivals")
    public PagedResponse<?> getMostViewed(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ){
        return productService.getNewArrivals(page, limit);
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

    @PostMapping("/by-skus")
    public List<SkuProductDTO> getProductsBySkus(@RequestBody List<String> skus) {
        return productService.getProductsBySkus(skus);
    }

    @GetMapping("/unified")
    public ResponseEntity<PagedResponse<?>> searchProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<Long> categoryIds,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "NEWEST") SortOption sort
    ) {
        return ResponseEntity.ok(productService.search(
                page, limit, search, categoryIds, gender,
                minPrice, maxPrice, minRating, sort
        ));
    }
}

