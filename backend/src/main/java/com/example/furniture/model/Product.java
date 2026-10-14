package com.example.furniture.model;

import com.example.furniture.ENUMS.Gender;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    @Column(nullable = false, unique = true)
    public String code;

    // Default price/canceledPrice — used when a variant doesn't override them
    @Column(nullable = false)
    private double price;

    private double canceledPrice;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnore
    private Category category;

    @ManyToOne
    @JoinColumn(name = "supplier_Id", nullable = false)
    @JsonIgnore
    private Supplier supplier;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Image> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @BatchSize(size = 20)
    @JsonManagedReference
    private List<ProductVariant> variants = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private Set<Rating> ratings = new HashSet<>();

    private boolean freeDelivery;
    private boolean fastDelivery;
    private String status = "AVAILABLE";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender = Gender.UNISEX;

    @Transient
    public double getAverageRating() {
        if (ratings == null || ratings.isEmpty()) return 0.0;
        double sum = 0.0;
        for (Rating rating : ratings) {
            sum += rating.getStars();
        }
        return sum / ratings.size();
    }

    @Transient
    public int getTotalQuantitySailed() {
        if (variants == null) return 0;
        return variants.stream().mapToInt(ProductVariant::getQuantitySailed).sum();
    }

    @Transient
    public int getTotalStock() {
        if (variants == null) return 0;
        return variants.stream().mapToInt(ProductVariant::getQuantity).sum();
    }

    @Override
    public String toString() {
        double averageRating = 0.0;
        if (ratings != null && !ratings.isEmpty()) {
            double sum = 0.0;
            for (Rating rating : ratings) {
                sum += rating.getStars();
            }
            averageRating = sum / ratings.size();
        }
        return
                "Product{" +
                        " id =" + id +
                        ", name =" + name +
                        ", code =" + code +
                        ", status =" + status +
                        ", categoryId =" + category.getId() +
                        ", rating =" + averageRating +
                        ", imagesCount =" + (images != null ? images.size() : 0) + "}";
    }
}