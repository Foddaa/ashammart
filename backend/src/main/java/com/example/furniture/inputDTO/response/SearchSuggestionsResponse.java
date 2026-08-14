package com.example.furniture.inputDTO.response;

import com.example.furniture.inputDTO.ProductSuggestionDTO;

import java.util.List;

public class SearchSuggestionsResponse {

    private final List<String> terms;
    private final List<ProductSuggestionDTO> products;

    public SearchSuggestionsResponse(List<String> terms, List<ProductSuggestionDTO> products) {
        this.terms = terms;
        this.products = products;
    }

    public List<String> getTerms() { return terms; }
    public List<ProductSuggestionDTO> getProducts() { return products; }
}