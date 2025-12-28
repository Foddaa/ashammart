package com.example.furniture.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false,unique=true)
    private String code;
    private String address;
    @OneToMany(mappedBy = "supplier")
    @JsonIgnore
    List<Product> products = new ArrayList<>();
}
