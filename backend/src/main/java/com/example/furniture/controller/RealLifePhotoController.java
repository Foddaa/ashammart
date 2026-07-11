package com.example.furniture.controller;


import com.example.furniture.inputDTO.RealLifePhotoDTO;
import com.example.furniture.repository.RealLifePhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/product")
public class RealLifePhotoController {

    @Autowired
    private RealLifePhotoRepository repository;

    @GetMapping("/realLife")
    public ResponseEntity<List<RealLifePhotoDTO>> getAll() {
        List<RealLifePhotoDTO> dtos = repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(p -> new RealLifePhotoDTO(p.getId(), p.getUrl()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}