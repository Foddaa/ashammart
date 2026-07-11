package com.example.furniture.inputDTO;

public class RealLifePhotoDTO {
    private Long id;
    private String image;

    public RealLifePhotoDTO(Long id, String image) {
        this.id = id;
        this.image = image;
    }

    public Long getId() { return id; }
    public String getImage() { return image; }
}
