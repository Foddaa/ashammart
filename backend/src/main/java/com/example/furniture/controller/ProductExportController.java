package com.example.furniture.controller;

import com.example.furniture.service.ProductCsvExporter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
public class ProductExportController {

    private final ProductCsvExporter exporter;

    public ProductExportController(ProductCsvExporter exporter) {
        this.exporter = exporter;
    }

    @GetMapping("/api/admin/products/export")
    public ResponseEntity<byte[]> exportProducts() {
        String csv = exporter.generateCsv();
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"products.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }
}