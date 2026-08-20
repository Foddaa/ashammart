package com.example.furniture.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "color_id", "size_id"}))
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    private Product product;

    @ManyToOne
    @JoinColumn(name = "color_id") // nullable: null = no color option
    private Color color;

    @ManyToOne
    @JoinColumn(name = "size_id") // nullable: null = no size option
    private Size size;

    @Column(nullable = false, unique = true)
    private String sku;

    // Nullable overrides: if null, fall back to product's price/canceledPrice
    private Double price;
    private Double canceledPrice;

    @Column(nullable = false)
    private int quantity; // stock for this specific variant

    private int quantitySailed;

    private String status = "AVAILABLE"; // e.g. AVAILABLE, OUT_OF_STOCK, DISCONTINUED

    @OneToMany(mappedBy = "productVariant", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<CartItem> cartItems = new ArrayList<>();
    @Transient
    public double getEffectivePrice() {
        return price != null ? price : product.getPrice();
    }

    @Transient
    public Double getEffectiveCanceledPrice() {
        return canceledPrice != null ? canceledPrice : (product.getCanceledPrice() != 0 ? product.getCanceledPrice() : null);
    }

    @Override
    public String toString() {
        return "ProductVariant{" +
                "id=" + id +
                ", sku='" + sku + '\'' +
                ", color=" + (color != null ? color.getName() : "none") +
                ", size=" + (size != null ? size.getName() : "none") +
                ", quantity=" + quantity +
                ", status='" + status + '\'' +
                '}';
    }
}