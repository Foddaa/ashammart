package com.example.furniture.service;

import com.example.furniture.model.Address;
import com.example.furniture.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
    @Autowired
    AddressRepository addressRepository;
    public ResponseEntity<Address> addAddress(Address address){
        addressRepository.save(address);
        return  ResponseEntity.ok().body(address);
    }
}
