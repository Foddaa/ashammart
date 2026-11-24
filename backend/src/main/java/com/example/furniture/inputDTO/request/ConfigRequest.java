package com.example.furniture.inputDTO.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConfigRequest {
    @NotBlank(message = "Key is required")
    private String key;

    private String value;
}