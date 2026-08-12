package com.example.furniture.inputDTO.response;

import java.util.List;

public class PagedResponse<T> {
    private List<T> products;
    private long totalItems;
    private int totalPages;
    private int currentPage;

    public PagedResponse(List<T> products, long totalItems, int totalPages, int currentPage) {
        this.products = products;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }

    public List<T> getProducts() { return products; }
    public long getTotalItems() { return totalItems; }
    public int getTotalPages() { return totalPages; }
    public int getCurrentPage() { return currentPage; }
}
