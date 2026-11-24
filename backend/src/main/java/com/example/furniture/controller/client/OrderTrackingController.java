package com.example.furniture.controller.client;

import com.example.furniture.JWT.JwtUtil;
import com.example.furniture.inputDTO.response.OrderDetailsDTO;
import com.example.furniture.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/client")
public class OrderTrackingController {

    @Autowired JwtUtil jwtUtil;
    @Autowired OrderService orderService;

    private static final Logger logger = LoggerFactory.getLogger(OrderTrackingController.class);

    @RequestMapping("/getOrders")
    public ResponseEntity<?> getOrders(@RequestHeader("Authorization") String authHeader){
        logger.info("getting orders request");
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        try {
            return ResponseEntity.ok().body(orderService.getOrdersByClient(email));
        } catch (Exception e) {
            return  ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

}
