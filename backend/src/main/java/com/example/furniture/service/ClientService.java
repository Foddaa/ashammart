package com.example.furniture.service;

import com.example.furniture.inputDTO.CartItemDTO;
import com.example.furniture.inputDTO.ClientDTO;
import com.example.furniture.inputDTO.ProductDTO;
import com.example.furniture.model.*;
import com.example.furniture.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ClientService {
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    CartItemRepository cartItemRepository;
    @Autowired
    CartRepository cartRepository;
    @Autowired
    RatingRepository ratingRepository;
    @Value("${file.upload-dir}")
    private String uploadDir;

//    public UserDetails getClientByEmail(String email) throws UsernameNotFoundException {
//        try {
//            Optional<User> user = userRepository.findByEmail(email);
//            if (!user.isEmpty()) {
//                Client client = clientRepository.findById(user.get().getId()).get();
//            }
//            return new org.springframework.security.core.userdetails.User(user.get().getEmail(), user.get().getPassword(), new ArrayList<>() // or user roles
//            );
//        } catch (Exception e) {
//            throw new UsernameNotFoundException("User not found: " + email);
//        }
//    }


//    public String addItemToCart(CartItemDTO cartItemDTO, String email) {
//        try {
//            User user = userRepository.findByEmail(email).get();
//            Client client = clientRepository.findById(user.getId()).get();
//            Product product = productRepository.findById(cartItemDTO.getProduct().getId()).get();
//            Cart cart = cartRepository.findById(client.getCart().getId()).get();
//            cart.setIsEmpty(false);
//            cartRepository.save(cart);
//            CartItem cartItem = new CartItem(client.getCart(), product, cartItemDTO.getComments(), cartItemDTO.getQuantity(), product.getPrice() * cartItemDTO.getQuantity());
//            cartItem.toString();
//            cartItemRepository.save(cartItem);
//
//            return "success";
//        } catch (Exception e) {
//            return e.toString();
//        }
//    }
    public Optional<Client> getClientByPhone(String phone) {
        Optional<Client> client = clientRepository.findByPhone(phone);
        return client;
    }

    public void save(Client client) {
        clientRepository.save(client);
    }
    public Client getClient(String email) {
        User user = userRepository.findByEmail(email).get();
        Client client = clientRepository.findById(user.getId()).get();
        return client;
    }

    @Transactional
    public List<CartItemDTO> getCartItemsWithEmail(String email) {
        Client client = getClient(email);
        Cart cart = client.getCart();

        List<CartItem> cartItems = cartItemRepository.getByCart(cart);

        return cartItems.stream().map(item -> {
            ProductDTO productDTO = new ProductDTO(item.getProduct());
            return new CartItemDTO(item.getId(), item.getComments(), item.getQuantity(), item.getCost(), productDTO);
        }).toList(); // or use .collect(Collectors.toList())
    }
    @Transactional
    public ResponseEntity<?> addReview(
            Long productId, int stars, String comment,
            List<MultipartFile> images, String name, String phone, String email) {
        try {
            // ⭐ Validate stars
            if (stars < 1 || stars > 5) {
                return ResponseEntity.badRequest().body("عدد النجوم يجب أن يكون بين 1 و 5");
            }

            if (!isValidPhone(phone)) {
                return ResponseEntity.badRequest().body("رقم الهاتف غير صالح، يجب أن يكون 11 رقم ويبدأ بـ 01");
            }
            System.out.println(email);
            if (email != null && !email.isBlank()) {
                String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
                if (!email.matches(emailRegex)) {
                    System.out.println("Email failed regex: " + email);
                    return ResponseEntity.badRequest().body("البريد غير صالح");
                }
            }


            Rating rating = new Rating();
            rating.setComment(comment);
            rating.setStars(stars);
            rating.setProduct(productRepository.findById(productId).orElseThrow(
                    () -> new NoSuchElementException("المنتج غير موجود")
            ));
            rating.setCreatedAt(LocalDateTime.now());

            List<RatingImage> imageList = new ArrayList<>();
            if (images != null) {
                for (MultipartFile file : images) {
                    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path reviewImagesPath = Paths.get(uploadDir, "ReviewImages");
                    Files.createDirectories(reviewImagesPath);
                    Path filePath = reviewImagesPath.resolve(filename);
                    Files.write(filePath, file.getBytes());
                    RatingImage img = new RatingImage();
                    img.setUrl("/uploads/ReviewImages/" + filename);
                    img.setRating(rating);
                    imageList.add(img);
                }
                rating.setImages(imageList);
            }

            if (getClientByPhone(phone).isPresent()) {
                rating.setClient(getClientByPhone(phone).get());
            } else {
                Client client = new Client();
                client.setName(name);
                client.setPhone(phone);
                if (email != null && !email.isEmpty()) client.setEmail(email);
                client.setCart(new Cart());
                save(client);
                rating.setClient(client);
            }

            ratingRepository.save(rating);
            return ResponseEntity.ok("تم إضافة التقييم بنجاح");

        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("المنتج غير موجود");
        } catch (MaxUploadSizeExceededException e) {
            return ResponseEntity.badRequest().body("حجم الملف المرفوع كبير جداً");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("حدث خطأ أثناء رفع الصور، يرجى المحاولة لاحقًا");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("خطأ في البيانات، قد يكون رقم الهاتف أو البريد الإلكتروني مسجل مسبقًا");
        }  catch (Exception e) {
            return ResponseEntity.badRequest().body("حدث خطأ غير متوقع، يرجى المحاولة لاحقًا");
        }
    }


    public ClientDTO getProfile(String email){
        Client client = getClient(email);
        return ClientDTO.toDTO(client);
    }
    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
    private boolean isValidPhone(String phone) {
        // Egyptian numbers example (starts with 01 and 11 digits total)
        return phone != null && phone.matches("^01[0-9]{9}$");
    }


}
