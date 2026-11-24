package com.example.furniture.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    /**
     * Display order within the product's image list (lower = first, 0 = main image on the product card).
     * Legacy rows all have 0 and fall back to id order.
     * Column name is quoted because ORDER is a reserved word in MySQL.
     */
    @Column(name = "`order`", nullable = false)
    private int order = 0;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;

    @ManyToOne
    @JoinColumn(name = "color_id") // nullable: null = general image, not color-specific
    private Color color;

    @Override
    public String toString() {
        return "Image{id=" + id + ", filename=" + url + ", color=" +
                (color != null ? color.getName() : "general") + "}";
    }
}