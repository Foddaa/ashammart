    package com.example.furniture.model;

    import jakarta.persistence.*;
    import lombok.Data;

    @Data
    @Entity
    public class Client extends User{
        @Column(unique = true)
        private String phone;
        @Column(nullable = false)
        private String name;
        @OneToOne(cascade = CascadeType.ALL)
        @JoinColumn(name = "address_id")
        private Address address;
        @OneToOne( cascade = CascadeType.ALL)
        @JoinColumn(name = "cart_id",nullable = false)
        private Cart cart;
    }
