package com.example.furniture.service;

import com.example.furniture.model.*;
import com.example.furniture.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    Logger logger = LoggerFactory.getLogger(UserService.class.getName());
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public Boolean register(SignupRequest request) {
        logger.info("Registering user: {}", request);
        if (request.getRole().toString().equals("EXECUTIVE") || request.getRole().toString().equals("ADMIN")) {
            logger.info("Registering : {}", request.getRole().toString());
            if (userRepository.existsByEmail(request.getEmail())) {
                logger.info("User already exists");
                return false;
            }
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());
            logger.info("Saving user: {}", user);
            try {
                userRepository.save(user);
            } catch (Exception e) {
                logger.error("Error saving user: {}", user, e);
                return false;
            }
            return true;
        }
        else {
            return false;
        }
    }

}
