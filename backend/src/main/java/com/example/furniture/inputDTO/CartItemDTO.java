package com.example.furniture.inputDTO;

import com.example.furniture.model.CartItem;
import com.example.furniture.model.ProductVariant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private Long id;
    private String comments;
    private int quantity;
    private double cost;
    private ProductDTO product;          // Still useful to show product info
    private ProductVariantDTO variant;   // Include variant details (color, size, price override)

    public CartItemDTO(CartItem cartItem) {
        this.id = cartItem.getId();
        this.comments = cartItem.getComments();
        this.quantity = cartItem.getQuantity();
        this.cost = cartItem.getCost();

        // Get product from the variant's product
        ProductVariant variant = cartItem.getProductVariant();
        if (variant != null) {
            this.product = new ProductDTO(variant.getProduct());
            this.variant = new ProductVariantDTO(variant);
        }
    }
}