package com.example.furniture.repository;

import com.example.furniture.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product,Long> {

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images LEFT JOIN FETCH p.ratings")
    List<Product> findAllWithImagesAndRatings();

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images WHERE p.category.id = :categoryId")
    List<Product> findByCategoryIdWithImages(@Param("categoryId") Long categoryId);

    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.images " + // Optional: fetch images if needed
            "WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "   OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Product> searchProductsByNameOrDescription(@Param("search") String search);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images ORDER BY p.quantitySailed DESC LIMIT 8")
    List<Product> findTop8ByQuantitySailed();

    @Query("""
    SELECT  p FROM Product p
    LEFT JOIN FETCH p.images
    WHERE p.id = :productId
""")
    Product findByIdWithImages(@Param("productId") Long productId);

    Product findByCode(String code);

}
