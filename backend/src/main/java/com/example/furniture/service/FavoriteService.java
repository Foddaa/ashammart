package com.example.furniture.service;

import com.example.furniture.inputDTO.ProductDTO;
import com.example.furniture.inputDTO.response.PagedResponse;
import com.example.furniture.inputDTO.response.ProductCardDto;
import com.example.furniture.model.Client;
import com.example.furniture.model.Favorite;
import com.example.furniture.model.Product;
import com.example.furniture.repository.ClientRepository;
import com.example.furniture.repository.FavoriteRepository;
import com.example.furniture.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final ClientRepository clientRepository;
    private final ProductService productService;

    @Transactional
    public void addFavorite(Long clientId, Long productId) {
        // Check if already exists (optional, but we have unique constraint)
        if (favoriteRepository.existsByClientIdAndProductId(clientId, productId)) {
            throw new RuntimeException("Product already in favorites");
        }
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Favorite favorite = new Favorite();
        favorite.setClient(client);
        favorite.setProduct(product);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long clientId, Long productId) {
        favoriteRepository.deleteByClientIdAndProductId(clientId, productId);
    }

    public boolean isFavorited(Long clientId, Long productId) {
        return favoriteRepository.existsByClientIdAndProductId(clientId, productId);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductCardDto> getFavorites(Long clientId, int page, int limit) {
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), limit);
        Page<Long> productIdPage = favoriteRepository.findProductIdsByClientId(clientId, pageable);
        return productService.buildCardPage(productIdPage, page);
    }
}