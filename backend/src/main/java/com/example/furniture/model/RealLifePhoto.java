package com.example.furniture.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "real_life_photos")
public class RealLifePhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName; // stored filename on disk

    @Column(nullable = false)
    private String url;      // public path, e.g. /api/uploads/real-life-photos/xxx.jpg

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public RealLifePhoto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
