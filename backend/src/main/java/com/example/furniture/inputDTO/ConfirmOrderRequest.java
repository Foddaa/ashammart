package com.example.furniture.inputDTO;

import com.example.furniture.model.Address;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class ConfirmOrderRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String paymentMethod;
    private Address address;
    // Optional: id of one of the signed-in client's saved addresses. When set, it is used instead of "address".
    private Long addressId;
    private double deliveryCost;
    private List<OrderProductVariantQuantity> items;

}
