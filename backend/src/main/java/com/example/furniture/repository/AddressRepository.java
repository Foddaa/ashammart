package com.example.furniture.repository;

import com.example.furniture.model.Address;
import com.example.furniture.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
