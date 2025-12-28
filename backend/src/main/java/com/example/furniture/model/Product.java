package com.example.furniture.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false,unique = true)
    public String code;

    @Column(nullable = false)
    private double price;

    private double canceledPrice;

    @ManyToOne
    @JoinColumn(name = "category_id",nullable = false)
    @JsonIgnore
    private Category category;

    @ManyToOne
    @JoinColumn(name = "supplier_Id",nullable = false)
    @JsonIgnore
    private Supplier supplier;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Image> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private Set<Rating> ratings=new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonBackReference
    private List<CartItem> cartItems;

    private int quantitySailed;

    @Transient
    public double getAverageRating() {
        if (ratings == null || ratings.isEmpty()) return 0.0;
        double sum = 0.0;
        for (Rating rating : ratings) {
            sum += rating.getStars();
        }
        return sum / ratings.size();
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
        return "Product{ id =" + id + ", name =" + name +", categoryId =" + category.getId() +", rating =" + averageRating +", imagesCount =" + (images != null ? images.size() : 0) +"}+\n";
    }
}