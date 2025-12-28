package com.example.furniture.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.security.PrivateKey;
@Data
@NoArgsConstructor
@Entity
public class CartItem {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonIgnore // Add this
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    private String comments;
    private int quantity;
    private double cost;
    public CartItem(Cart cart,Product product,String comments,int quantity,double cost){
        this.cart=cart;
        this.product=product;
        this.comments=comments;
        this.quantity=quantity;
        this.cost=cost;
    }
    @Override
    public String toString() {
        return "CartItem{" +
                "id=" + id +
                ", comments='" + comments + '\'' +
                ", quantity=" + quantity +
                ", cost=" + cost +
                '}';
    }
}
