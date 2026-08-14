package com.example.furniture.service;

import com.example.furniture.inputDTO.ProductSuggestionDTO;
import com.example.furniture.inputDTO.response.SearchSuggestionsResponse;
import com.example.furniture.inputDTO.response.TrendingResponse;
import com.example.furniture.model.Product;
import com.example.furniture.model.SearchLog;
import com.example.furniture.repository.ProductRepository;
import com.example.furniture.repository.SearchLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SearchService{

    private final ProductRepository productRepository;
    private final SearchLogRepository searchLogRepository;

    public SearchService(ProductRepository productRepository, SearchLogRepository searchLogRepository) {
        this.productRepository = productRepository;
        this.searchLogRepository = searchLogRepository;
    }

    public SearchSuggestionsResponse getSuggestions(String query, int limit) {
        String trimmed = query == null ? "" : query.trim();

        if (trimmed.isEmpty()) {
            return new SearchSuggestionsResponse(List.of(), List.of());
        }

        int fetchSize = Math.max(limit, 10);

        List<Product> matches = productRepository.searchByNameContaining(
                trimmed, PageRequest.of(0, fetchSize)
        );

        List<ProductSuggestionDTO> products = matches.stream()
                .limit(limit)
                .map(this::toDto)
                .collect(Collectors.toList());

        Set<String> terms = new LinkedHashSet<>();
        for (Product p : matches) {
            if (terms.size() >= 5) break;
            terms.add(p.getName());
        }

        return new SearchSuggestionsResponse(terms.stream().toList(), products);
    }

    public TrendingResponse getTrending(int limit) {
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        List<SearchLogRepository.TrendingTermProjection> rows =
                searchLogRepository.findTrendingTerms(since, limit);

        List<String> terms = rows.stream()
                .map(SearchLogRepository.TrendingTermProjection::getTerm)
                .toList();

        if (terms.isEmpty()) {
            terms = List.of("shirt", "skort");
        }

        return new TrendingResponse(terms);
    }

    public void logSearch(String term, int resultCount, Long userId) {
        if (term == null || term.trim().isEmpty()) return;
        searchLogRepository.save(new SearchLog(term.trim(), resultCount, userId));
    }

    private ProductSuggestionDTO toDto(Product p) {
        return new ProductSuggestionDTO(
                String.valueOf(p.getId()),
                p.getImages().get(0).getUrl(),
                p.getName(),
                p.getPrice()
        );
    }
}