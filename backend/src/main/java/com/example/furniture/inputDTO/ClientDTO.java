package com.example.furniture.inputDTO;

import com.example.furniture.model.Address;
import com.example.furniture.model.Cart;
import com.example.furniture.model.Client;
import lombok.Data;

@Data
public class ClientDTO {
    private Long id;
    private String email;
    private String phone;
    private String name;
    private Address address; // As a string
    private Long cartId;

    public static ClientDTO toDTO(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setPhone(client.getPhone());
        dto.setName(client.getName());

        if (client.getAddress() != null) {
            dto.setAddress(client.getAddress());
        } else {
            dto.setAddress(null);
        }

        if (client.getCart() != null) {
            dto.setCartId(client.getCart().getId());
        } else {
            dto.setCartId(null);
        }

        return dto;
    }
}

