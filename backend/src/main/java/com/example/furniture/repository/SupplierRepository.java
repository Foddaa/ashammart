package com.example.furniture.repository;

import com.example.furniture.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier,Long> {
    Supplier findByCode(String l);
}
