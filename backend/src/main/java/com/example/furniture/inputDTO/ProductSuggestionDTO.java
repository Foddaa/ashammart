package com.example.furniture.inputDTO;

public class ProductSuggestionDTO {

    private final String id;
    private final String imageUrl;
    private final String name;
    private final double price;

    public ProductSuggestionDTO(String id, String imageUrl, String name, double price) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.name = name;
        this.price = price;
    }

    public String getId() { return id; }
    public String getImageUrl() { return imageUrl; }
    public String getName() { return name; }
    public double getPrice() { return price; }
}