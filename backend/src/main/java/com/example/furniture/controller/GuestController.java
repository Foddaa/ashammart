package com.example.furniture.controller;

import com.example.furniture.inputDTO.ConfirmOrderRequest;
import com.example.furniture.service.ClientService;
import com.example.furniture.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/guest")
public class GuestController {
    private final OrderService orderService;
    private final ClientService clientService;
    GuestController(OrderService orderService, ClientService clientService) {
        this.orderService = orderService;
        this.clientService = clientService;
    }
    @PostMapping("/confirmOrder")
    public ResponseEntity<?> confirmOrder(@RequestBody ConfirmOrderRequest request) {
        try {
            return orderService.confirmOrder(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/addReview")
    public ResponseEntity<?> addReview(@RequestParam("productId") Long productId,
                                       @RequestParam("stars") int stars,
                                       @RequestParam("comment") String comment,
                                       @RequestParam(value = "images", required = false) List<MultipartFile> images,
                                       @RequestParam(value = "name", required = true) String name,
                                       @RequestParam(value = "phone", required = true) String phone,
                                       @RequestParam(value = "email", required = false) String email
    ) throws IOException {
        return clientService.addReview(productId, stars, comment, images, name, phone, email);
    }

}
