package com.example.furniture.controller;

import com.example.furniture.inputDTO.request.ConfigRequest;
import com.example.furniture.model.MerchantConfiguration;
import com.example.furniture.service.MerchantConfigurationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/merchant-config")
@RequiredArgsConstructor
public class MerchantConfigurationController {

    private final MerchantConfigurationService service;

    // GET ALL (Returns a simple JSON Object: {"key": "value", "key2": "value2"})
    @GetMapping
    public ResponseEntity<Map<String, String>> getAllConfigs() {
        return ResponseEntity.ok(service.getAllConfigsAsMap());
    }

    // GET ONE BY KEY
    @GetMapping("/{key}")
    public ResponseEntity<MerchantConfiguration> getConfig(@PathVariable String key) {
        return ResponseEntity.ok(service.getConfigByKey(key));
    }

    // CREATE OR UPDATE ONE (Upsert)
    @PostMapping
    public ResponseEntity<MerchantConfiguration> saveConfig(@Valid @RequestBody ConfigRequest request) {
        return ResponseEntity.ok(service.saveConfig(request.getKey(), request.getValue()));
    }

    // BULK UPSERT (Save multiple settings at once)
    @PostMapping("/bulk")
    public ResponseEntity<Void> saveAllConfigs(@RequestBody Map<String, String> configMap) {
        service.saveAllConfigs(configMap);
        return ResponseEntity.ok().build();
    }

    // DELETE BY KEY
    @DeleteMapping("/{key}")
    public ResponseEntity<Void> deleteConfig(@PathVariable String key) {
        service.deleteConfig(key);
        return ResponseEntity.noContent().build();
    }
}