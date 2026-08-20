package com.example.furniture.repository;

import com.example.furniture.model.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SizeRepository extends JpaRepository<Size, Long> {
    Optional<Size> findByNameIgnoreCase(String name);
}