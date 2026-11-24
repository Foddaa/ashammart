package com.example.furniture.repository;

import com.example.furniture.model.Client;
import com.example.furniture.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o WHERE o.status = :status")
    ArrayList<Order> findAllByStatus(String status);


    List<Order> getOrdersByClient(Client client);

    List<Order> findByClientOrderByOrderDateDesc(Client client);

    // Used for fetching the specific order details securely
    Optional<Order> findByIdAndClient(Long id, Client client);
}
