package com.example.furniture.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.ArrayList;
import java.util.List;
@Data
@Entity
public class Cart {
    @Id
    @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CartItem> items = new ArrayList<>();

    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isEmpty=true;
    @Override
    public String toString() {
        return "Cart{" +
                "id=" + id +
                ", isEmpty=" + isEmpty +
                '}';
    }
}