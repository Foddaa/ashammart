package com.example.furniture.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Client extends User {

    @Column(unique = true)
    private String phone;

    @Column(nullable = false)
    private String name;

    @OneToMany(
            mappedBy = "client",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<Address> addresses = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    // Convenience helpers
    public void addAddress(Address address) {
        addresses.add(address);
        address.setClient(this);
    }

    public void removeAddress(Address address) {
        addresses.remove(address);
        address.setClient(null);
    }
}