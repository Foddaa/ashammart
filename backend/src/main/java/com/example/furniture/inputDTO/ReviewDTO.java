package com.example.furniture.inputDTO;

import com.example.furniture.model.Client;
import com.example.furniture.model.Rating;
import com.example.furniture.model.RatingImage;
import com.example.furniture.repository.ClientRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class ReviewDTO {
    private String clientName;
    private String comment;
    private int stars;
    private List<String> imageUrls;
    private long productId;
    private LocalDateTime createdAt;
    public ReviewDTO() {
        // Default constructor for Jackson
    }

    public ReviewDTO(Rating rating) {
        this.clientName = rating.getClient().getName();
        this.stars = rating.getStars();
        this.comment = rating.getComment();
        this.createdAt = rating.getCreatedAt();
        this.imageUrls = rating.getImages()
                .stream()
                .map(RatingImage::getUrl)
                .toList();
    }
}

