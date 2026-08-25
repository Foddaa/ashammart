package com.example.furniture.controller;

import com.example.furniture.service.ProductCsvExporter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
public class ProductExportController {

    private final ProductCsvExporter exporter;

    // UTF-8 BOM — required so Excel correctly detects/renders Arabic (and other non-ASCII) text
    private static final byte[] UTF8_BOM = { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF };

    public ProductExportController(ProductCsvExporter exporter) {
        this.exporter = exporter;
    }

    @GetMapping("/api/admin/products/export")
    public ResponseEntity<byte[]> exportProducts() throws IOException {
        String csv = exporter.generateCsv();
        byte[] csvBytes = csv.getBytes(StandardCharsets.UTF_8);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        baos.write(UTF8_BOM);
        baos.write(csvBytes);
        byte[] finalBytes = baos.toByteArray();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"products.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(finalBytes);
    }
}