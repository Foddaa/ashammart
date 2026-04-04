package com.example.furniture.inputDTO;

import com.example.furniture.ENUMS.UpdatePricesType;
import lombok.Data;

@Data
public class UpdatePricesRequest {
    private UpdatePricesType updatePricesType;
    private double value;

}
