package com.example.furniture.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class OrderItem {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    private int quantity;
    private double cost;
    private String comments;
}