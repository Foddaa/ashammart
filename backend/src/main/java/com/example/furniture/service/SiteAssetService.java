package com.example.furniture.service;


import com.example.furniture.model.SiteAsset;
import com.example.furniture.repository.SiteAssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
public class SiteAssetService {

    @Autowired
    private SiteAssetRepository assetRepository;

    private static final Map<String, String> ASSET_KEY_TO_FILENAME = Map.ofEntries(
            Map.entry("logo", "logo.ico"),
            Map.entry("slider1", "HeroImg1.webp"),
            Map.entry("slider2", "HeroImg2.webp"),
            Map.entry("slider3", "HeroImg3.webp"),
            Map.entry("slider4", "HeroImg4.webp"),
            Map.entry("slider5", "HeroImg5.webp"),
            Map.entry("slider6", "HeroImg6.webp"),
            Map.entry("slider7", "HeroImg7.webp"),
            Map.entry("slider8", "HeroImg8.webp"),
            Map.entry("slider9", "HeroImg9.webp"),
            Map.entry("slider10", "HeroImg10.webp"),
            Map.entry("slider11", "HeroImg11.webp"),
            Map.entry("slider12", "HeroImg12.webp"),
            Map.entry("slider13", "HeroImg13.webp"),
            Map.entry("slider14", "HeroImg14.webp"),
            Map.entry("slider15", "HeroImg15.webp"),
            Map.entry("slider16", "HeroImg16.webp"),
            Map.entry("slider17", "HeroImg17.webp"),
            Map.entry("slider18", "HeroImg18.webp"),
            Map.entry("slider19", "HeroImg19.webp"),
            Map.entry("slider20", "HeroImg20.webp"),
            Map.entry("heroVideo", "HeroSectionVedio.mp4"),
            Map.entry("bestSeller1", "bestSeller1.webp"),
            Map.entry("bestSeller2", "bestSeller2.webp"),
            Map.entry("bestSeller3", "bestSeller3.webp"),
            Map.entry("mostRated1", "mostRated1.webp"),
            Map.entry("mostRated2", "mostRated2.webp"),
            Map.entry("mostRated3", "mostRated3.webp"),
            Map.entry("fastDelivery", "fastDelivery.webp"),
            Map.entry("realLifePhotos", "realLifePhotos.webp")
    );

    private static final Map<String, String> ASSET_KEY_TO_TYPE = Map.ofEntries(
            Map.entry("logo", "image"),
            Map.entry("slider1", "image"),
            Map.entry("slider2", "image"),
            Map.entry("slider3", "image"),
            Map.entry("slider4", "image"),
            Map.entry("slider5", "image"),
            Map.entry("slider6", "image"),
            Map.entry("slider7", "image"),
            Map.entry("slider8", "image"),
            Map.entry("slider9", "image"),
            Map.entry("slider10", "image"),
            Map.entry("slider11", "image"),
            Map.entry("slider12", "image"),
            Map.entry("slider13", "image"),
            Map.entry("slider14", "image"),
            Map.entry("slider15", "image"),
            Map.entry("slider16", "image"),
            Map.entry("slider17", "image"),
            Map.entry("slider18", "image"),
            Map.entry("slider19", "image"),
            Map.entry("slider20", "image"),
            Map.entry("heroVideo", "video"),
            Map.entry("bestSeller1", "image"),
            Map.entry("bestSeller2", "image"),
            Map.entry("bestSeller3", "image"),
            Map.entry("mostRated1", "image"),
            Map.entry("mostRated2", "image"),
            Map.entry("mostRated3", "image"),
            Map.entry("fastDelivery", "image"),
            Map.entry("realLifePhotos", "image")
    );

    // Get the data URL endpoint for frontend
    public String getAssetDataUrl(String assetKey) {
        return "/api/admin/assets/data/" + assetKey;
    }

    // Retrieve binary data for an asset
    public byte[] getAssetData(String assetKey) {
        Optional<SiteAsset> optional = assetRepository.findByAssetKey(assetKey);
        if (optional.isPresent() && optional.get().getImageData() != null) {
            return optional.get().getImageData();
        }
        return null;
    }

    // Get mime type for an asset
    public String getAssetMimeType(String assetKey) {
        SiteAsset asset = assetRepository.findByAssetKey(assetKey)
                .orElseThrow(() -> new RuntimeException("Asset not found: " + assetKey));
        return asset.getMimeType();
    }

    // Update asset by saving file bytes into database
    public void updateAsset(String assetKey, MultipartFile file) throws IOException {
        String targetFileName = ASSET_KEY_TO_FILENAME.get(assetKey);
        if (targetFileName == null) {
            throw new IllegalArgumentException("Invalid asset key: " + assetKey);
        }

        SiteAsset asset = assetRepository.findByAssetKey(assetKey).orElse(new SiteAsset());
        asset.setAssetKey(assetKey);
        asset.setFileName(targetFileName);
        asset.setFilePath("/api/admin/assets/data/" + assetKey);  // virtual URL
        asset.setFileType(file.getContentType().startsWith("video/") ? "video" : "image");
        asset.setMimeType(file.getContentType());
        asset.setFileSize(file.getSize());
        asset.setImageData(file.getBytes());   // store in DB

        assetRepository.save(asset);
    }
}