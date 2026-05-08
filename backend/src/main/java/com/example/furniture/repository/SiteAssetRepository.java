package com.example.furniture.repository;

import com.example.furniture.model.SiteAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface SiteAssetRepository extends JpaRepository<SiteAsset, Long> {
    Optional<SiteAsset> findByAssetKey(String assetKey);
}