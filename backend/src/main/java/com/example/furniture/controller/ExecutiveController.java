package com.example.furniture.controller;

import com.example.furniture.inputDTO.OrderPreviewDTO;
import com.example.furniture.model.Order;
import com.example.furniture.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/executive")
public class ExecutiveController {
    @Autowired
    OrderService orderService;
    @GetMapping
    public String executive(){
        return "success";
    }
    @GetMapping("/allOrders")
    public ResponseEntity<?> allOrders(@RequestParam String status){
        try {
            List<Map<String, Object>> orders = orderService.getSimplifiedOrdersView(status);
            return ResponseEntity.ok(orders);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/byId")
    public ResponseEntity<?> getById(@RequestParam Long id){
        try {
            Map<String, Object> order = orderService.getOrder(id);
            return ResponseEntity.ok(order);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PatchMapping("/updateStatus")
    public ResponseEntity<?> updateStatus(@RequestParam Long id,@RequestParam String status){
        try {
            orderService.updateStatus(id,status);
            return ResponseEntity.ok("success");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
