package com.example.furniture.inputDTO.response;

import lombok.Data;

@Data
public class OrderItemDTO {
    private Long id;
    private Long variantId; // Needed for the frontend key
    private String name;
    private String size;
    private String color;
    private double price;
    private int quantity;
    private String image; // Just the first image URL for the card
}
