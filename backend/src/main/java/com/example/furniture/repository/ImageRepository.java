package com.example.furniture.repository;

import com.example.furniture.model.Image;
import com.example.furniture.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByProduct(Product product);
}
