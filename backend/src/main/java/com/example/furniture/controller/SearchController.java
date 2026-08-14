package com.example.furniture.controller;


import com.example.furniture.inputDTO.request.LogSearchRequest;
import com.example.furniture.inputDTO.response.SearchSuggestionsResponse;
import com.example.furniture.inputDTO.response.TrendingResponse;
import com.example.furniture.service.SearchService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }
    @GetMapping("/suggestions")
    public SearchSuggestionsResponse suggestions(
            @RequestParam("q") String query,
            @RequestParam(value = "limit", defaultValue = "6") int limit
    ) {
        int safeLimit = Math.min(Math.max(limit, 1), 20);
        return searchService.getSuggestions(query, safeLimit);
    }

    @GetMapping("/trending")
    public TrendingResponse trending(
            @RequestParam(value = "limit", defaultValue = "6") int limit
    ) {
        int safeLimit = Math.min(Math.max(limit, 1), 20);
        return searchService.getTrending(safeLimit);
    }

    @PostMapping("/log")
    public void logSearch( @RequestBody LogSearchRequest request) {
        searchService.logSearch(request.getTerm(), request.getResultCount(), null);
    }
}