package com.example.furniture.repository;

import com.example.furniture.model.Address;
import com.example.furniture.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByClient(Client client);

    Optional<Address> findByIdAndClient(Long id, Client client);
}
