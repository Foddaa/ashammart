package com.example.furniture.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_log")
public class SearchLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String term;

    @Column(name = "term_normalized", nullable = false)
    private String termNormalized;

    @Column(name = "result_count", nullable = false)
    private int resultCount;

    @Column(name = "user_id")
    private Long userId; // nullable — guests search too

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public SearchLog() {}

    public SearchLog(String term, int resultCount, Long userId) {
        this.term = term;
        this.termNormalized = term.trim().toLowerCase();
        this.resultCount = resultCount;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }

    // --- getters / setters ---

    public Long getId() { return id; }

    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }

    public String getTermNormalized() { return termNormalized; }
    public void setTermNormalized(String termNormalized) { this.termNormalized = termNormalized; }

    public int getResultCount() { return resultCount; }
    public void setResultCount(int resultCount) { this.resultCount = resultCount; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
