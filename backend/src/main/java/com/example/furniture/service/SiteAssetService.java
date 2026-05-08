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

    private static final Map<String, String> ASSET_KEY_TO_FILENAME = Map.of(
            "logo", "logo.ico",
            "slider1", "HeroImg1.webp",
            "slider2", "HeroImg2.webp",
            "slider3", "HeroImg3.webp",
            "heroVideo", "HeroSectionVedio.mp4",
            "bestSeller", "ad5.webp",
            "mostRated", "ad6.webp"
    );

    private static final Map<String, String> ASSET_KEY_TO_TYPE = Map.of(
            "logo", "image",
            "slider1", "image",
            "slider2", "image",
            "slider3", "image",
            "heroVideo", "video",
            "bestSeller", "image",
            "mostRated", "image"
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