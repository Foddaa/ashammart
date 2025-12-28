package com.example.furniture.inputDTO;

import com.example.furniture.model.Image;
import com.example.furniture.model.Product;
import com.example.furniture.model.Rating;
import com.example.furniture.repository.CategoryRepository;
import com.example.furniture.repository.SupplierRepository;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String code;
    private double price;
    private double canceledPrice;
    private Long categoryId;
    private String supplierCode;
    private List<Image> images = new ArrayList<>();
    private double averageRating;
    private List<ReviewDTO> ratings; // <-- use DTO not entity
    public ProductDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.code = product.getCode();
        this.price = product.getPrice();
        this.canceledPrice = product.getCanceledPrice();
        this.categoryId = product.getCategory().getId();
        this.supplierCode = product.getSupplier().getCode();
        this.images = product.getImages();
        this.averageRating = product.getAverageRating(); // use method from Option 1
    }
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SupplierRepository supplierRepository;
    public Product toProduct() {
        Product product = new Product();
        product.setId(id);
        return product;
    }


    public static ProductDTO toDto(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setCode(product.getCode());
        dto.setPrice(product.getPrice());
        dto.setCanceledPrice(product.getCanceledPrice());
        dto.setCategoryId(product.getCategory().getId());
        dto.setSupplierCode(product.getSupplier().getCode());
        dto.setAverageRating(product.getAverageRating());
        dto.setImages(product.getImages());
        return dto;
    }
    public static ProductDTO withRatings(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.id = product.getId();
        dto.name = product.getName();
        dto.description = product.getDescription();
        dto.code = product.getCode();
        dto.price = product.getPrice();
        dto.canceledPrice = product.getCanceledPrice();
        dto.categoryId = product.getCategory().getId();
        dto.supplierCode = product.getSupplier().getCode();
        dto.images = product.getImages();
        dto.averageRating = product.getAverageRating();
        List<ReviewDTO> ratingDTOs = product.getRatings()
                .stream()
                .map(ReviewDTO::new)
                .toList();
        dto.setRatings(ratingDTOs);        return dto;
    }
}

