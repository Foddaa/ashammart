package com.example.furniture.inputDTO;

import lombok.Data;
import java.util.List;

@Data
public class ColorImageMappingDTO {
    private Long colorId;
    private List<Integer> imageIndices; // indexes in the uploaded files array
}