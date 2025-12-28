package com.example.furniture.controller;

import com.example.furniture.JWT.JwtUtil;
import com.example.furniture.inputDTO.ClientDTO;
import com.example.furniture.inputDTO.ConfirmOrderRequest;
import com.example.furniture.service.ClientService;
import com.example.furniture.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/client")
public class ClientController {
    @Autowired
    ClientService clientService;
    @Autowired
    OrderService orderService;
    @Autowired
    JwtUtil jwtUtil;

    @GetMapping
    public String client() {
        return "success";
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

    @GetMapping("/getProfile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        ClientDTO client = clientService.getProfile(email);
        return ResponseEntity.ok(client);
    }

//    @PutMapping("/updateClient")
//    public ResponseEntity<?> updateClient(@RequestBody ClientDTO client, @RequestHeader("Authorization") String authHeader) {
//        String email = jwtUtil.extractEmail(authHeader.substring(7));
//        return ResponseEntity.ok(clientService.updateClient(client, email)); //clientService.updateClient(client,email);
//    }

}
