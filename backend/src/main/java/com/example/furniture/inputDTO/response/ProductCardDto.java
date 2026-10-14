package com.example.furniture.inputDTO.response;

import java.util.List;

public record ProductCardDto(Long id, String name, Double price, Double canceledPrice,
                             Double averageRating, String imageUrl, List<ColorDto> colors) {

    // used by the JPQL query (colors are filled in afterwards)
    public ProductCardDto(Long id, String name, Double price, Double canceledPrice,
                          Double averageRating, String imageUrl) {
        this(id, name, price, canceledPrice, averageRating, imageUrl, List.of());
    }

    public ProductCardDto withColors(List<ColorDto> colors) {
        return new ProductCardDto(id, name, price, canceledPrice, averageRating, imageUrl, colors);
    }
}