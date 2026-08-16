package com.example.furniture.repository;

import com.example.furniture.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface CustomProductRepository {
    Page<Product> findAllOrderByAverageRating(Specification<Product> spec, Pageable pageable);
}