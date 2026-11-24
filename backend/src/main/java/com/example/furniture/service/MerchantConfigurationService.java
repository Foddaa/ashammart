package com.example.furniture.service;

import com.example.furniture.model.MerchantConfiguration;
import com.example.furniture.repository.MerchantConfigurationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MerchantConfigurationService {

    private final MerchantConfigurationRepository repository;

    // Get all configs as a simple Map (Key -> Value) for easy frontend consumption
    public Map<String, String> getAllConfigsAsMap() {
        return repository.findAll().stream()
                .collect(Collectors.toMap(
                        MerchantConfiguration::getConfigKey,
                        config -> config.getConfigValue() != null ? config.getConfigValue() : ""
                ));
    }

    // Get all configs as a List (standard approach)
    public List<MerchantConfiguration> getAllConfigs() {
        return repository.findAll();
    }

    // Get single config by its Key
    public MerchantConfiguration getConfigByKey(String key) {
        return repository.findByConfigKey(key)
                .orElseThrow(() -> new RuntimeException("Configuration not found for key: " + key));
    }

    // Create or Update (Upsert) a single config
    @Transactional
    public MerchantConfiguration saveConfig(String key, String value) {
        MerchantConfiguration config = repository.findByConfigKey(key)
                .orElse(new MerchantConfiguration());

        config.setConfigKey(key);
        config.setConfigValue(value);
        return repository.save(config);
    }

    // Bulk Update (Very useful if the frontend sends the whole settings form at once)
    @Transactional
    public void saveAllConfigs(Map<String, String> configMap) {
        configMap.forEach(this::saveConfig);
    }

    // Delete by Key
    @Transactional
    public void deleteConfig(String key) {
        if (repository.findByConfigKey(key).isEmpty()) {
            throw new RuntimeException("Configuration not found for key: " + key);
        }
        repository.deleteByConfigKey(key);
    }
}