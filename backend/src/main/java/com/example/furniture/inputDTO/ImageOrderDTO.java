package com.example.furniture.inputDTO;

import lombok.Data;

/**
 * One entry of the final image order sent by the admin edit page.
 * Exactly one of the fields is set:
 *  - existingId: id of an image that already exists on the product
 *  - newIndex:   index of a newly uploaded file in the "images" multipart array
 */
@Data
public class ImageOrderDTO {
    private Long existingId;
    private Integer newIndex;
}
