package com.example.furniture.repository;

import com.example.furniture.inputDTO.response.ProductCardDto;
import com.example.furniture.inputDTO.response.ProductColorRow;
import com.example.furniture.model.Product;
import com.example.furniture.model.ProductVariant;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product>,
        CustomProductRepository {

    @Query(
            value = "SELECT p.id FROM Product p " +
                    "WHERE p.status != 'DELETED' " +
                    "AND (:search IS NULL OR :search = '' " +
                    "     OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
                    "     OR LOWER(p.code) LIKE LOWER(CONCAT('%', :search, '%')))",
            countQuery = "SELECT COUNT(p) FROM Product p " +
                    "WHERE p.status != 'DELETED' " +
                    "AND (:search IS NULL OR :search = '' " +
                    "     OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
                    "     OR LOWER(p.code) LIKE LOWER(CONCAT('%', :search, '%')))"
    )
    Page<Long> findProductIds(@Param("search") String search, Pageable pageable);

    // Step 2: fetch full details only for this page's IDs.
    @Query("""
        SELECT DISTINCT p
        FROM Product p
        LEFT JOIN FETCH p.images
        LEFT JOIN FETCH p.ratings
        WHERE p.id IN :ids
    """)
    List<Product> findByIdsWithImagesAndRatings(@Param("ids") List<Long> ids);

    @Query("""
    SELECT DISTINCT v
    FROM ProductVariant v
    LEFT JOIN FETCH v.color
    LEFT JOIN FETCH v.size
    WHERE v.product.id IN :ids
""")
    List<ProductVariant> findVariantsByProductIds(@Param("ids") List<Long> ids);


    @Query(
            value = "SELECT p.id FROM Product p " +
                    "WHERE p.status != 'DELETED' " +
                    "AND p.category.id = :categoryId " +
                    "AND (:search IS NULL OR :search = '' " +
                    "     OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
                    "     OR LOWER(p.code) LIKE LOWER(CONCAT('%', :search, '%')))",
            countQuery = "SELECT COUNT(p) FROM Product p " +
                    "WHERE p.status != 'DELETED' " +
                    "AND p.category.id = :categoryId " +
                    "AND (:search IS NULL OR :search = '' " +
                    "     OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
                    "     OR LOWER(p.code) LIKE LOWER(CONCAT('%', :search, '%')))"
    )
    Page<Long> findProductByCategoryIds(@Param("categoryId") Long categoryId, @Param("search") String search, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.images " +
            "WHERE (LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "   OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))" +
            "   AND p.status != 'DELETED'")
    List<Product> searchProductsByNameOrDescription(@Param("search") String search);

    @Query(
            value = """
        SELECT p.id FROM Product p
        WHERE p.status != 'DELETED'
        ORDER BY (SELECT COALESCE(SUM(v.quantitySailed), 0) FROM ProductVariant v WHERE v.product = p) DESC
        """,
            countQuery = "SELECT COUNT(p.id) FROM Product p WHERE p.status != 'DELETED'"
    )
    Page<Long> findBestSellersIds(Pageable pageable);

    @Query(
            value = """
        SELECT p.id
        FROM Product p
        WHERE p.status <> 'DELETED'
        ORDER BY p.id DESC
        """,
            countQuery = """
        SELECT COUNT(p.id)
        FROM Product p
        WHERE p.status <> 'DELETED'
        """
    )
    Page<Long> findNewArrivalIds(Pageable pageable);

    @Query(
            value = """
        SELECT p.id FROM Product p
        WHERE p.status != 'DELETED'
          AND (SELECT AVG(r.stars) FROM Rating r WHERE r.product = p) IS NOT NULL
        ORDER BY (SELECT AVG(r.stars) FROM Rating r WHERE r.product = p) DESC
    """,
            countQuery = """
        SELECT COUNT(DISTINCT p.id) FROM Product p
        WHERE p.status != 'DELETED'
          AND (SELECT AVG(r.stars) FROM Rating r WHERE r.product = p) IS NOT NULL
    """
    )
    Page<Long> findMostRatedIds(Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images WHERE p.fastDelivery = true AND p.status != 'DELETED'")
    List<Product> findFastDelivery();

    @Query("""
        SELECT DISTINCT p
        FROM Product p
        LEFT JOIN FETCH p.images
        WHERE p.id = :productId
        AND p.status != 'DELETED'
    """)
    Optional<Product> findByIdWithImages(@Param("productId") Long productId);

    @Query("""
        SELECT DISTINCT v
        FROM ProductVariant v
        LEFT JOIN FETCH v.color
        LEFT JOIN FETCH v.size
        WHERE v.product.id = :productId
    """)
    List<ProductVariant> findByProductIdWithColorAndSize(@Param("productId") Long productId);
    Product findByCode(String code);

    @Modifying
    @Query("""
            UPDATE Product p
            SET p.price = ROUND(p.price + (p.price * :percentage / 100), 1) ,
             p.canceledPrice = ROUND(p.canceledPrice + (p.canceledPrice * :percentage / 100), 1)
             """)
    int updatePricesByPercentage(@Param("percentage") double percentage);

    @Modifying
    @Query("""
        UPDATE Product p
        SET
            p.price = ROUND(
                CASE
                    WHEN (p.price + :amount) < 0 THEN 0
                    ELSE (p.price + :amount)
                END
            , 1),
            p.canceledPrice = ROUND(
                CASE
                    WHEN (p.canceledPrice + :amount) < 0 THEN 0
                    ELSE (p.canceledPrice + :amount)
                END
            , 1)
        """)
    int updatePricesByFixed(@Param("amount") double amount);

    @Modifying
    @Query("UPDATE Product p SET p.status = :status WHERE p.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    @Query("""
        SELECT DISTINCT p FROM Product p
        LEFT JOIN FETCH p.images
        WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))
        ORDER BY
            CASE WHEN LOWER(p.name) LIKE LOWER(CONCAT(:query, '%')) THEN 0 ELSE 1 END,
            p.name ASC
    """)
    List<Product> searchByNameContaining(@Param("query") String query, Pageable pageable);

    @Query("""
    SELECT new com.example.furniture.inputDTO.response.ProductCardDto(
        p.id, p.name, p.price, p.canceledPrice,
        COALESCE((SELECT AVG(r.stars) FROM Rating r WHERE r.product = p), 0.0),
        (SELECT i.url FROM Product p2 JOIN p2.images i
          WHERE p2.id = p.id
            AND i.id = (SELECT MIN(i2.id) FROM Product p3 JOIN p3.images i2 WHERE p3.id = p.id))
    )
    FROM Product p
    WHERE p.id IN :ids
""")
    List<ProductCardDto> findCardsByIds(@Param("ids") List<Long> ids);

    @Query("""
    SELECT new com.example.furniture.inputDTO.response.ProductColorRow(v.product.id, c.id, c.hexCode)
    FROM ProductVariant v
    JOIN v.color c
    WHERE v.product.id IN :ids
    GROUP BY v.product.id, c.id, c.hexCode
""")
    List<ProductColorRow> findColorsByProductIds(@Param("ids") List<Long> ids);
}