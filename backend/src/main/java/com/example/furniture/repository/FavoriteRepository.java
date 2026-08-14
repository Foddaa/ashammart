package com.example.furniture.repository;

import com.example.furniture.model.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    // Check if a product is favorited by a client
    boolean existsByClientIdAndProductId(Long clientId, Long productId);

    // Delete a favorite by client and product
    void deleteByClientIdAndProductId(Long clientId, Long productId);

    // Find all favorites for a client (returns Favorite entities – can be used to fetch products)
    Page<Favorite> findByClientId(Long clientId, Pageable pageable);

    // Alternatively, fetch only product IDs for a client (more efficient for checking multiple)
    @Query("SELECT f.product.id FROM Favorite f WHERE f.client.id = :clientId")
    Page<Long> findProductIdsByClientId(@Param("clientId") Long clientId, Pageable pageable);
}
