package com.example.furniture.controller.client;

import com.example.furniture.JWT.JwtUtil;
import com.example.furniture.inputDTO.ClientDTO;
import com.example.furniture.service.ClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client")
public class ClientController {
    @Autowired
    ClientService clientService;
    @Autowired
    JwtUtil jwtUtil;


    private static final Logger logger = LoggerFactory.getLogger(ClientController.class);
    @GetMapping
    public String client() {
        return "success";
    }

    @GetMapping("/getProfile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        logger.debug("get Profile request received");
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        ClientDTO client = clientService.getProfile(email);
        logger.info("get profile request returned");
        return ResponseEntity.ok(client);
    }




//    @PutMapping("/updateClient")
//    public ResponseEntity<?> updateClient(@RequestBody ClientDTO client, @RequestHeader("Authorization") String authHeader) {
//        String email = jwtUtil.extractEmail(authHeader.substring(7));
//        return ResponseEntity.ok(clientService.updateClient(client, email)); //clientService.updateClient(client,email);
//    }

}
