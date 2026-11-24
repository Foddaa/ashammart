package com.example.furniture.inputDTO.response;

import com.example.furniture.model.Address;
import lombok.Getter;

@Getter
public class AddressDTO {
    private Long id;
    private String city;
    private String description;

    public  AddressDTO() {
    }
    public AddressDTO(Address address) {
        this.id = address.getId();
        this.city = address.getCity();
        this.description = address.getDescription();
    }

    @Override
    public String toString() {
        return "AddressDTO{" +
                "id=" + id +
                ", city='" + city + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
