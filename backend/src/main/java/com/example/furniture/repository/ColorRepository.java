package com.example.furniture.repository;

import com.example.furniture.model.Color;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ColorRepository extends JpaRepository<Color, Long> {
    Optional<Color> findByNameIgnoreCase(String name);
}