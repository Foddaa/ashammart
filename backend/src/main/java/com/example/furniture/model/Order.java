package com.example.furniture.model;

import com.example.furniture.ENUMS.PaymentMethod;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Data
@ToString(exclude = "items")

@Entity
@Table(name = "orders")

public class Order {
    @Id
    @GeneratedValue
    private Long id;

    private LocalDate orderDate;
    private LocalDate estimatedDeliveryDate;
    private String status; // e.g., PENDING, PAID, SHIPPED
    private double subtotal;
    private double totalCost;
    private double deliveryCost;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @ManyToOne private Client client;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();
}
