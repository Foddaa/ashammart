package com.example.furniture.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "merchant_configurations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Configuration key is required")
    @Column(name = "config_key", nullable = false, unique = true)
    private String configKey;

    @Column(name = "config_value", length = 1000) // 1000 chars allows for long URLs or descriptions
    private String configValue;
}