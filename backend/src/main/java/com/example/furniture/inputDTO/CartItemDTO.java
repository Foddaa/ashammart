package com.example.furniture.inputDTO;

import com.example.furniture.model.CartItem;
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
    private ProductDTO product;
    public CartItemDTO(CartItem cartItem) {
        this.comments = cartItem.getComments();
        this.quantity = cartItem.getQuantity();
        this.cost = cartItem.getCost();
        this.product = new ProductDTO(cartItem.getProduct());
    }


}

