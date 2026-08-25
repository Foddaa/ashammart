package com.example.furniture.inputDTO.response;

import lombok.Data;
import java.util.List;

@Data
public class SkuProductDTO {
    private String sku;
    private Long productId;
    private String name;
    private Double price;
    private Double canceledPrice;
    private String code;
    private List<SkuImageDTO> images;
    private String colorName;
    private String sizeName;
    private Integer quantity;
    private String status;
}