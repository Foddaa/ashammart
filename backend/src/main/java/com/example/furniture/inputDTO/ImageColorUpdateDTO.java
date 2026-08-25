package com.example.furniture.inputDTO;

import lombok.Data;

@Data
public class ImageColorUpdateDTO {
    private Long imageId;
    private Long colorId; // null = general
}