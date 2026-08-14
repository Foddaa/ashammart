package com.example.furniture.service;

import com.example.furniture.model.*;
import com.example.furniture.repository.ClientRepository;
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

    @Autowired
    private ClientRepository clientRepository;

    public boolean register(SignupRequest request) {
        logger.info("Registering user: {}", request);
        if (request.getRole().toString().equals("EXECUTIVE") || request.getRole().toString().equals("ADMIN") || request.getRole().toString().equals("USER")) {
            logger.info("Registering : {}", request.getRole().toString());
            if (userRepository.existsByEmail(request.getEmail())) {
                logger.info("User already exists");
                return false;
            }

            if (request.getRole().toString().equals("USER")) {
                Client client = new Client();
                client.setName(request.getName());
                client.setPhone(request.getPhone());
                client.setEmail(request.getEmail());
                client.setPassword(passwordEncoder.encode(request.getPassword()));
                client.setRole(request.getRole());
                client.setCart(new Cart());
                clientRepository.save(client);
                return true;
            } else {
                User user = new User();
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setRole(request.getRole());
                try {
                    userRepository.save(user);
                    return true;
                } catch (Exception e) {
                    logger.error("Error saving user: {}", user, e);
                    return false;
                }
            }
        } else {
            return false;
        }
    }

}
