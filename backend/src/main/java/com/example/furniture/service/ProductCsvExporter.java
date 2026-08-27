package com.example.furniture.service;

import com.example.furniture.model.Product;
import com.example.furniture.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductCsvExporter {

    private final ProductRepository productRepository;

    public ProductCsvExporter(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ✅ Only the "useful" columns — edit this list to add/remove fields
    private static final String[] HEADERS = {
            "id", "name","description", "code", "price",
            "category", "supplier", "quantitySailed", "averageRating","images"
    };

    @Transactional(readOnly = true)
    public String generateCsv() {
        List<Product> products = productRepository.findAll();

        StringBuilder sb = new StringBuilder();
        sb.append(String.join(",", HEADERS)).append("\n");

        for (Product p : products) {
            sb.append(toCsvRow(p)).append("\n");
        }

        return sb.toString();
    }

    private String toCsvRow(Product p) {
        return String.join(",",
                csv(p.getId()),
                csv(p.getName()),
                csv(p.getDescription()),
                csv(p.getCode()),
                csv(p.getPrice()),
                csv(p.getCategory() != null ? p.getCategory().getName() : ""),
                csv(p.getSupplier() != null ? p.getSupplier().getName() : ""),
                csv(p.getQuantitySailed()),
                csv(p.getAverageRating()),
                csv(p.getImages().stream()
                        .map(i -> "https://anttikka.com/api" + i.getUrl())
                        .reduce((a, b) -> a + ", " + b)
                        .orElse(""))        );
    }

    private String csv(Object value) {
        if (value == null) return "";
        String s = value.toString();
        s = cleanText(s);
        if (s.contains(",") || s.contains("\"")) {
            s = "\"" + s.replace("\"", "\"\"") + "\"";
        }
        return s;
    }

    // Removes newlines/extra whitespace so multi-line fields stay on one CSV row
    private String cleanText(String s) {
        return s.replace("\r\n", " ")
                .replace("\n", " ")
                .replace("\r", " ")
                .trim()
                .replaceAll("\\s+", " ");
    }
}