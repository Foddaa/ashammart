package com.example.furniture.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Color {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String hexCode; // e.g. "#FF0000"
}