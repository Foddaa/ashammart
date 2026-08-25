package com.example.furniture.repository;

import com.example.furniture.model.Cart;
import com.example.furniture.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @Query("SELECT ci FROM CartItem ci " +
            "JOIN FETCH ci.productVariant v " +
            "JOIN FETCH v.product p " +
            "WHERE ci.cart = :cart")
    List<CartItem> findByCartWithVariant(@Param("cart") Cart cart);

    void deleteByCart(Cart cart);
}