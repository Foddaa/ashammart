package com.example.furniture.service;

import com.example.furniture.inputDTO.request.AddressRequest;
import com.example.furniture.inputDTO.response.AddressDTO;
import com.example.furniture.model.Address;
import com.example.furniture.model.Client;
import com.example.furniture.repository.AddressRepository;
import com.example.furniture.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {
    private static final Logger logger = LoggerFactory.getLogger(AddressService.class);

    private final AddressRepository addressRepository;
    private final ClientRepository clientRepository;
    private final ClientService clientService;

    @Transactional(readOnly = true)
    public List<AddressDTO> getMyAddresses(String email) {
        Client client = clientService.getClient(email);
        logger.debug("getMyAddresses client id {}", client.getId());
        List<Address> addresses = addressRepository.findByClient(client);
        List<AddressDTO> myAddresses = new ArrayList<>();
        for (Address address : addresses) {
            AddressDTO addressDTO = new AddressDTO(address);
            logger.info(addressDTO.toString());
            myAddresses.add(addressDTO);
        }
        logger.info("got {} addresses", myAddresses.size());
        return myAddresses;
    }

    @Transactional
    public AddressDTO addAddress(String email, AddressRequest request) {
        Client client = clientService.getClient(email);

        Address address = new Address();
        address.setCity(request.getCity().trim());
        address.setDescription(request.getDescription().trim());
        address.setClient(client);
        addressRepository.save(address);
        return new AddressDTO(address);
    }

    @Transactional
    public void deleteAddress(String email, Long addressId) {
        Client client = clientService.getClient(email);

        Address address = addressRepository
                .findByIdAndClient(addressId, client)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Address not found or does not belong to you"
                ));

        addressRepository.delete(address);
    }

}