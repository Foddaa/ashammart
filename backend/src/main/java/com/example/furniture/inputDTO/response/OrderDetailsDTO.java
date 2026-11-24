package com.example.furniture.inputDTO.response;

import com.example.furniture.ENUMS.PaymentMethod;
import com.example.furniture.model.Address;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class OrderDetailsDTO {
    private Long id;
    private LocalDate orderDate;
    private LocalDate estimatedDeliveryDate;
    private String status;
    private double subtotal;
    private double totalCost;
    private double deliveryCost;
    private Address address;
    private PaymentMethod paymentMethod;
    private List<OrderItemDTO> items; // The mapped items
}