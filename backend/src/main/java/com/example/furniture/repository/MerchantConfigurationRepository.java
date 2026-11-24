package com.example.furniture.repository;

import com.example.furniture.model.MerchantConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MerchantConfigurationRepository extends JpaRepository<MerchantConfiguration, Long> {
    Optional<MerchantConfiguration> findByConfigKey(String configKey);
    void deleteByConfigKey(String configKey);
}