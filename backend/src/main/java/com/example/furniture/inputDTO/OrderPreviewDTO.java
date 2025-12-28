package com.example.furniture.inputDTO;

import com.example.furniture.inputDTO.CartItemDTO;
import com.example.furniture.model.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderPreviewDTO {
    private List<CartItemDTO> cartItemsDTO;
    private double subtotal;
    private LocalDate estimatedDeliveryDate;
}
