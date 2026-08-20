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