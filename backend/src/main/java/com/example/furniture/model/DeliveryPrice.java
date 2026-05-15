package com.example.furniture.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class DeliveryPrice {
    @Id
    private Long id;
    private String city;
    private Double price;
}