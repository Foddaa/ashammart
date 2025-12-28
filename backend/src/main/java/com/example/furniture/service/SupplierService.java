package com.example.furniture.service;

import com.example.furniture.model.Supplier;
import com.example.furniture.model.SupplierRequest;
import com.example.furniture.repository.SupplierRepository;
import com.example.furniture.repository.SupplierRequestRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Service
public class SupplierService {
    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private SupplierRequestRepository supplierRequestRepository;

    private static final Logger logger = LoggerFactory.getLogger(SupplierService.class);

    public ResponseEntity<?> addSupplier(Supplier supplier) {
        try {
            if (supplier == null || supplier.getName() == null || supplier.getAddress() == null || supplier.getCode() == null) {
                logger.error("SupplierService.addSupplier: Received invalid supplier data -> {}", supplier);
                return ResponseEntity.badRequest().body("بيانات المورد غير موجودة.");
            }

            Supplier savedSupplier = supplierRepository.save(supplier);
            logger.info("SupplierService.addSupplier: Successfully added supplier -> {}", savedSupplier);

            return ResponseEntity.ok(savedSupplier);

        } catch (DataIntegrityViolationException ex) {
            logger.error("SupplierService.addSupplier: DataIntegrityViolationException -> {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("كود المورد موجود بالفعل: " );

        } catch (ConstraintViolationException ex) {
            logger.error("SupplierService.addSupplier: ConstraintViolationException -> {}", ex.getMessage(), ex);
            return ResponseEntity.badRequest()
                    .body("خطأ في التحقق من البيانات: " );

        } catch (DataAccessException ex) {
            logger.error("SupplierService.addSupplier: DataAccessException -> {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("خطأ في قاعدة البيانات: " );

        } catch (Exception ex) {
            logger.error("SupplierService.addSupplier: Unexpected exception -> {}", ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("خطأ غير متوقع: " );
        }
    }

    public ResponseEntity<?> updateSupplier(Long id, Supplier updatedSupplier) {
        try {
            logger.info("SupplierService.updateSupplier: Attempting to update supplier with id {}", id);
            Supplier supplier = supplierRepository.findById(id).orElse(null);

            if (supplier != null) {
                supplier.setName(updatedSupplier.getName());
                supplier.setAddress(updatedSupplier.getAddress());
                supplier.setCode(updatedSupplier.getCode());
                supplierRepository.save(supplier);

                logger.info("SupplierService.updateSupplier: Successfully updated supplier with id {}", id);
                return ResponseEntity.ok(supplier);
            } else {
                logger.warn("SupplierService.updateSupplier: Supplier with id {} not found", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ المورد غير موجود");
            }

        } catch (DataIntegrityViolationException ex) {
            logger.error("SupplierService.updateSupplier: Duplicate supplier code -> {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("❌ كود المورد مستخدم بالفعل، يرجى اختيار كود آخر");
        } catch (Exception ex) {
            logger.error("SupplierService.updateSupplier: Exception while updating supplier with id {} -> {}", id, ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ خطأ غير متوقع أثناء تحديث المورد");
        }
    }

    public List<Supplier> getAllSuppliers() {
        try {
            logger.info("SupplierService.getAllSuppliers: Fetching all suppliers");
            List<Supplier> suppliers = supplierRepository.findAll();
            logger.info("SupplierService.getAllSuppliers: Retrieved {} suppliers", suppliers.size());
            return suppliers;
        } catch (Exception ex) {
            logger.error("SupplierService.getAllSuppliers: Exception -> {}", ex.getMessage(), ex);
            throw ex; // keeping logic flow the same, still propagates error
        }
    }

    public Supplier getSupplierById(Long id) {
        try {
            logger.info("SupplierService.getSupplierById: Fetching supplier by id {}", id);
            Supplier supplier = supplierRepository.findById(id).orElse(null);

            if (supplier != null) {
                logger.info("SupplierService.getSupplierById: Found supplier with id {}", id);
            } else {
                logger.warn("SupplierService.getSupplierById: Supplier with id {} not found", id);
            }
            return supplier;
        } catch (Exception ex) {
            logger.error("SupplierService.getSupplierById: Exception while fetching supplier with id {} -> {}", id, ex.getMessage(), ex);
            throw ex; // same logic, rethrow
        }
    }

    public void addSupplierRequest(SupplierRequest request) {
        try {
            logger.info("SupplierService.addSupplierRequest: Adding new supplier request -> {}", request);
            supplierRequestRepository.save(request);
            logger.info("SupplierService.addSupplierRequest: Successfully added supplier request");
        } catch (Exception ex) {
            logger.error("SupplierService.addSupplierRequest: Exception while adding supplier request -> {}", ex.getMessage(), ex);
            throw ex; // same behavior, just logs now
        }
    }

    public ResponseEntity<?> getAllSuppliersRequests() {
        logger.info("SupplierService.getAllSuppliersRequests: Fetching all supplier requests");
        try {
            List<SupplierRequest> requests = supplierRequestRepository.findAll();
            logger.info("SupplierService.getAllSuppliersRequests: Retrieved {} supplier requests", requests.size());
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("SupplierService.getAllSuppliersRequests: Exception -> {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("couldn't get requests");
        }
    }
}
