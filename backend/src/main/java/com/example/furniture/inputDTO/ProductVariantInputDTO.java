package com.example.furniture.inputDTO;

import lombok.Data;

@Data
public class ProductVariantInputDTO {
    private Long id;           // null => new variant; non-null => update existing one
    private Long colorId;      // nullable
    private Long sizeId;       // nullable
    private Double price;      // nullable => inherit product default price
    private Double canceledPrice; // nullable
    private int quantity;
}