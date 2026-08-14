package com.example.furniture.controller;

import com.example.furniture.JWT.JwtUtil;
import com.example.furniture.inputDTO.ProductDTO;
import com.example.furniture.inputDTO.response.PagedResponse;
import com.example.furniture.service.ClientService;
import com.example.furniture.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private ClientService clientService;
    private final FavoriteService favoriteService;
    private final JwtUtil jwtUtil;
    FavoriteController(FavoriteService favoriteService, JwtUtil jwtUtil, ClientService clientService) {
        this.favoriteService = favoriteService;
        this.jwtUtil = jwtUtil;
        this.clientService = clientService;
    }


    // Add to favorites
    @PostMapping("/add/{productId}")
    public ResponseEntity<Void> addFavorite(@PathVariable Long productId, @RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        Long clientId = clientService.getClient(email).getId();
        favoriteService.addFavorite(clientId, productId);
        return ResponseEntity.ok().build();
    }

    // Remove from favorites
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long productId, @RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        Long clientId = clientService.getClient(email).getId();
        favoriteService.removeFavorite(clientId, productId);
        return ResponseEntity.ok().build();
    }

    // Check if product is favorited
    @GetMapping("/check/{productId}")
    public ResponseEntity<Boolean> isFavorited(@PathVariable Long productId, @RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        Long clientId = clientService.getClient(email).getId();
        return ResponseEntity.ok(favoriteService.isFavorited(clientId, productId));
    }

    // List all favorite products (paginated)
    @GetMapping
    public ResponseEntity<PagedResponse<ProductDTO>> getFavorites(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        Long clientId = clientService.getClient(email).getId();
        return ResponseEntity.ok(favoriteService.getFavorites(clientId, page, limit));
    }
}