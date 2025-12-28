package com.example.furniture.repository;

import com.example.furniture.model.SupplierRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRequestRepository extends JpaRepository<SupplierRequest, Long> {

}
