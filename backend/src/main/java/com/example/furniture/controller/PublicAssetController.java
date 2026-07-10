package com.example.furniture.controller;

import com.example.furniture.model.DeliveryPrice;
import com.example.furniture.repository.DeliveryPriceRepository;
import com.example.furniture.service.SiteAssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/assets")
public class PublicAssetController {

    @Autowired
    private DeliveryPriceRepository deliveryPriceRepository;
    @Autowired
    private SiteAssetService assetService;

    @GetMapping("/logo")
    public ResponseEntity<byte[]> getLogo() {
        return getAssetData("logo");
    }

    @GetMapping("/slider/{index}")
    public ResponseEntity<byte[]> getSlider(@PathVariable int index) {
        String assetKey = "slider" + index;
        return getAssetData(assetKey);
    }

    @GetMapping("/hero-video")
    public ResponseEntity<byte[]> getHeroVideo() {
        return getAssetData("heroVideo");
    }

    @GetMapping("/best-seller/{index}")
    public ResponseEntity<byte[]> getBestSeller(@PathVariable int index) {
        String assetKey = "bestSeller" + index;
        return getAssetData(assetKey);
    }

    @GetMapping("/most-rated/{index}")
    public ResponseEntity<byte[]> getMostRated(@PathVariable int index) {
        String assetKey = "mostRated" + index;
        return getAssetData(assetKey);
    }

    private ResponseEntity<byte[]> getAssetData(String assetKey) {
        try {
            byte[] data = assetService.getAssetData(assetKey);
            if (data == null || data.length == 0) {
                return ResponseEntity.notFound().build();
            }
            String mimeType = assetService.getAssetMimeType(assetKey);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(mimeType));
            return ResponseEntity.ok().headers(headers).body(data);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/delivery/prices")
    public ResponseEntity<?> getDeliveryPrices() {
        List<DeliveryPrice> deliveryPrices = deliveryPriceRepository.findAll();
        return ResponseEntity.ok(deliveryPrices);
    }
}