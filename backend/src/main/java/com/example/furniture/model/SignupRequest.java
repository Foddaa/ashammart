package com.example.furniture.model;

import com.example.furniture.ENUMS.Role;
import lombok.Data;

import java.security.PrivateKey;

@Data
public class SignupRequest {
    private String password;
    private Role role;
    private String confirmPassword;
    private String email;
    private String phone;
    private String name;
}