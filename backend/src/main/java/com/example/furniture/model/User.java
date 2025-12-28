package com.example.furniture.model;

import com.example.furniture.ENUMS.Role;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true ,nullable = false)
    protected String email;
    @Column(nullable = false)
    protected String password;
    protected Role role= Role.USER;
}
