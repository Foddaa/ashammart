package com.example.furniture.controller.client;

import com.example.furniture.JWT.JwtUtil;
import com.example.furniture.inputDTO.request.AddressRequest;
import com.example.furniture.service.AddressService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
public class AddressController {
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    AddressService addressService;
    private static final Logger logger = LoggerFactory.getLogger(AddressController.class);

    @GetMapping("/getAddresses")
    public ResponseEntity<List<?>> getMyAddresses(@RequestHeader("Authorization") String authHeader) {
        logger.debug("get Addresses request received");
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        return ResponseEntity.ok(addressService.getMyAddresses(email));
    }

    @PostMapping("/addAddress")
    public ResponseEntity<?> addAddress(
            @Valid @RequestBody AddressRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        logger.debug("add Address request received");
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        logger.debug("add Address request completed");
        try {
            return ResponseEntity.ok(addressService.addAddress(email, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/deleteAddress/{id}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        logger.debug("delete Address request received");
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        addressService.deleteAddress(email, id);
        logger.debug("delete Address request completed");
        return ResponseEntity.noContent().build();
    }

}
