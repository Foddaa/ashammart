package com.example.furniture.service;

import com.example.furniture.ENUMS.Role;
import com.example.furniture.model.*;
import com.example.furniture.repository.ClientRepository;
import com.example.furniture.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserService {


    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    ClientRepository clientRepository;


    public UserDetails getUserByEmail(String email) throws UsernameNotFoundException {
        try {
            Optional<User> user = userRepository.findByEmail(email);
            return new org.springframework.security.core.userdetails.User(
                    user.get().getEmail(),
                    user.get().getPassword(),
                    new ArrayList<>() // or user roles
            );
        } catch (Exception e) {
            throw new UsernameNotFoundException("User not found: " + email);
        }
    }


    public String register(SignupRequest request) {
        User user = new User();
        if (request.getRole() == null) {
            request.setRole(Role.USER);
        }
        if (request.getRole().toString().equals("EXECUTIVE") || request.getRole().toString().equals("ADMIN")) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return "User already exists";
            }
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());
            userRepository.save(user);
            return "success";
        }
        else {
            return "fail";
        }
//        else {
//            if (clientRepository.existsByEmail(request.getEmail())) {
//                return "User already exists";
//            }
//            if (clientRepository.existsByPhone(request.getPhone())) {
//                return "this phone already used";
//            }
//
//            Client client = new Client();
//            client.setPhone(request.getPhone());
//            client.setName(request.getName());
////            client.setEmail(request.getEmail());
//            client.setAddress(new Address());
////            client.setRole(Role.USER);
////            client.setPassword(passwordEncoder.encode(request.getPassword()));
//            Cart cart = new Cart();
//            client.setCart(cart);
//            clientRepository.save(client);
//            return "success";
//        }
    }

}
