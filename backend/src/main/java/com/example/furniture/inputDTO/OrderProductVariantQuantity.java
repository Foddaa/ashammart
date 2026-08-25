package com.example.furniture.inputDTO;

import lombok.Data;

@Data
public class OrderProductVariantQuantity {
    private Long variantId;
    private String sku; // NEW FIELD
    private int quantity;
}