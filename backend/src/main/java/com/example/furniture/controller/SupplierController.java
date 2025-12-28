package com.example.furniture.controller;

import com.example.furniture.model.Supplier;
import com.example.furniture.model.SupplierRequest;
import com.example.furniture.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @PostMapping("addRequest")
    public ResponseEntity<?> addCSupplier(@RequestBody SupplierRequest request){
        try {
            supplierService.addSupplierRequest(request);
            return ResponseEntity.ok("request saved");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/all")
    public List<Supplier> getAllSuppliers(){
        return supplierService.getAllSuppliers();
    }
}
