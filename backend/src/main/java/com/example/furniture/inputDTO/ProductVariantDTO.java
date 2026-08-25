package com.example.furniture.inputDTO;

import com.example.furniture.model.ProductVariant;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductVariantDTO {
    private Long id;
    private Long colorId;
    private String colorName;
    private String colorHex;
    private Long sizeId;
    private String sizeName;
    private String sku;
    private Double price;          // null means inherit from product
    private Double canceledPrice;  // null means inherit
    private int quantity;
    private String status;

    public ProductVariantDTO(ProductVariant variant) {
        this.id = variant.getId();
        this.colorId = variant.getColor() != null ? variant.getColor().getId() : null;
        this.colorName = variant.getColor() != null ? variant.getColor().getName() : null;
        this.colorHex = variant.getColor() != null ? variant.getColor().getHexCode() : null;
        this.sizeId = variant.getSize() != null ? variant.getSize().getId() : null;
        this.sizeName = variant.getSize() != null ? variant.getSize().getName() : null;
        this.sku = variant.getSku();
        this.price = variant.getPrice();
        this.canceledPrice = variant.getCanceledPrice();
        this.quantity = variant.getQuantity();
        this.status = variant.getStatus();
    }
}