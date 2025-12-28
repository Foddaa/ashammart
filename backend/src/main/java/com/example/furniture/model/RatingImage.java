package com.example.furniture.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.Id;
import lombok.ToString;

@Data
@Entity
public class RatingImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    @ManyToOne
    @JoinColumn(name = "rating_id")
    @JsonBackReference
    private Rating rating;
    @Override
    public String toString() {
        return "Image{id=" + id + ", filename=" + url + "}";
    }
}
