package com.example.furniture.inputDTO.response;

import java.util.List;

public class TrendingResponse {

    private final List<String> terms;

    public TrendingResponse(List<String> terms) {
        this.terms = terms;
    }

    public List<String> getTerms() { return terms; }
}