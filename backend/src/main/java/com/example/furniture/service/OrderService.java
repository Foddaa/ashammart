package com.example.furniture.service;

import com.example.furniture.ENUMS.PaymentMethod;
import com.example.furniture.inputDTO.*;
import com.example.furniture.model.*;
import com.example.furniture.repository.CartItemRepository;
import com.example.furniture.repository.OrderRepository;
import com.example.furniture.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    ClientService clientService;
    @Autowired
    CartItemRepository cartItemRepository;
    @Autowired
    ProductRepository productRepository;

    @Transactional
    public OrderPreviewDTO placeOrder(String email) {
        try {
            Client client = clientService.getClient(email);
            Cart cart = client.getCart();
            List<CartItem> cartItems = cartItemRepository.getByCart(cart);
            double subtotal = cartItems.stream().mapToDouble(CartItem::getCost).sum();
            LocalDateTime estimatedDate = LocalDateTime.now().plusDays(10);
            OrderPreviewDTO orderPreviewDTO = new OrderPreviewDTO(
                    cartItems.stream()
                            .map(item -> {
                                ProductDTO productDTO = new ProductDTO(item.getProduct());
                                return new CartItemDTO(
                                        item.getId(),
                                        item.getComments(),
                                        item.getQuantity(),
                                        item.getCost(),
                                        productDTO
                                );
                            })
                            .toList()
                    , subtotal, estimatedDate.toLocalDate());
            return orderPreviewDTO;
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public ResponseEntity<?> confirmOrder(ConfirmOrderRequest request) {
        try {
            PaymentMethod payment;
            try {
                payment = PaymentMethod.valueOf(request.getPaymentMethod());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("طريقة الدفع غير صالحة");
            }
            if (request.getPhone() == null || !request.getPhone().matches("^01[0-9]{9}$")) {
                return ResponseEntity.badRequest().body("رقم الهاتف غير صالح، يجب أن يكون 11 رقم ويبدأ بـ 01");
            }
            if (request.getEmail() != null && !request.getEmail().isBlank()) {
                if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                    return ResponseEntity.badRequest().body("البريد الإلكتروني غير صالح");
                }
            }
            if (request.getItems() == null || request.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body("قائمة المنتجات فارغة");
            }
            List<Long> Ids = request.getItems()
                    .stream()
                    .map(orderProduct_Id_quantity::getProductId)
                    .collect(Collectors.toList());
            List<Product> products = productRepository.findAllById(Ids);
            if (products.isEmpty()) {
                return ResponseEntity.badRequest().body("لم يتم العثور على المنتجات المطلوبة");
            }
            Order order = new Order();
            order.setStatus("Pending");
            order.setAddress(request.getAddress());
            order.setOrderDate(LocalDateTime.now().toLocalDate());
            order.setEstimatedDeliveryDate(LocalDate.now().plusDays(10));
            order.setPaymentMethod(payment);
            List<OrderItem> orderItems = new ArrayList<>();
            for (orderProduct_Id_quantity item : request.getItems()) {
                OrderItem orderItem = new OrderItem();
                orderItem.setProduct(products.get(Ids.indexOf(item.getProductId())));
                orderItem.setQuantity(item.getQuantity());
                orderItem.setCost(orderItem.getProduct().getPrice() * orderItem.getQuantity());
                orderItem.setOrder(order);
                orderItems.add(orderItem);
            }
            order.setItems(orderItems);
            order.setSubtotal(order.getItems().stream().mapToDouble(OrderItem::getCost).sum());
            order.setDeliveryCost(calculateDeliveryCost(request.getAddress()));
            order.setTotalCost(order.getSubtotal() + order.getDeliveryCost());
            for (OrderItem orderItem : order.getItems()) {
                Product product = productRepository.findById(orderItem.getProduct().getId())
                        .orElseThrow(() -> new NoSuchElementException("المنتج غير موجود"));
                product.setQuantitySailed(product.getQuantitySailed() + orderItem.getQuantity());
                productRepository.save(product);
            }
            if (clientService.getClientByPhone(request.getPhone()).isPresent()) {
                order.setClient(clientService.getClientByPhone(request.getPhone()).get());
            } else {
                Client client = new Client();
                client.setName(request.getFirstName() + " " + request.getLastName());
                client.setPhone(request.getPhone());
                if (request.getEmail() != null && !request.getEmail().isBlank()) {
                    client.setEmail(request.getEmail());
                }
                client.setAddress(request.getAddress());
                client.setCart(new Cart());
                clientService.save(client);
                order.setClient(client);
            }

            orderRepository.save(order);
            return ResponseEntity.ok("تم تأكيد الطلب بنجاح");

        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("المنتج غير موجود");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("خطأ في البيانات، قد يكون رقم الهاتف أو البريد الإلكتروني مسجل مسبقًا");
        } catch (Exception e) {
            System.out.println("Error in confirmOrder: " + e.getMessage());
            return ResponseEntity.badRequest().body("حدث خطأ غير متوقع، يرجى المحاولة لاحقًا");
        }
    }


    public double calculateDeliveryCost(Address address) {
        if (address.getCity().equals("القاهرة") || address.getCity().equals("الجيزة"))
            return 300;
        else {
            return 500;
        }
    }

    @Transactional
    public List<Map<String, Object>> getSimplifiedOrdersView(String status) {
        List<Order> orders = orderRepository.findAllByStatus(status); // or fetch based on client
        return orders.stream().map(order -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("orderId", order.getId());
            dto.put("orderDate", order.getOrderDate());
            if (order.getEstimatedDeliveryDate() != null) {
                dto.put("estimatedDeliveryDate", order.getEstimatedDeliveryDate());
            }
            dto.put("status", order.getStatus());
            dto.put("subtotal", order.getSubtotal());
            dto.put("deliveryCost", order.getDeliveryCost());
            dto.put("totalCost", order.getTotalCost());
            dto.put("paymentMethod", order.getPaymentMethod());
            dto.put("clientName", order.getClient().getName());
            System.out.println(order.getItems());
            List<String> productNames = order.getItems().stream()
                    .map(item -> new ProductDTO(item.getProduct()).getName() + " x " + item.getQuantity() + " = " + item.getCost())
                    .collect(Collectors.toList());

            dto.put("productNames", productNames);

            return dto;
        }).collect(Collectors.toList());
    }


    @Transactional
    public Map<String, Object> getOrder(Long orderId) {

        Order order = orderRepository.findById(orderId).orElse(null);
        Map<String, Object> dto = new HashMap<>();
//        dto.put("clientId", order.getClient().getId());
        dto.put("clientName", order.getClient().getName());
        dto.put("clientPhone", order.getClient().getPhone());
        dto.put("deliveryAddress", order.getAddress());
        List<String> productNames = order.getItems().stream()
                .map(item -> new ProductDTO(item.getProduct()).getCode() + " x " + item.getQuantity() + " = " + item.getCost())
                .collect(Collectors.toList());
        dto.put("productNames", productNames);
        dto.put("orderId", order.getId());
        dto.put("orderDate", order.getOrderDate());
        dto.put("estimatedDeliveryDate", order.getEstimatedDeliveryDate());
        dto.put("status", order.getStatus());
        dto.put("subtotal", order.getSubtotal());
        dto.put("deliveryCost", order.getDeliveryCost());
        dto.put("totalCost", order.getTotalCost());
        dto.put("paymentMethod", order.getPaymentMethod());
        return dto;
    }

    @Transactional
    public String updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElse(null);
        order.setStatus(status);
        orderRepository.save(order);
        return "success";
    }
}