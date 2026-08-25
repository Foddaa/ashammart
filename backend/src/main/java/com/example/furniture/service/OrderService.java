package com.example.furniture.service;

import com.example.furniture.ENUMS.PaymentMethod;
import com.example.furniture.inputDTO.*;
import com.example.furniture.model.*;
import com.example.furniture.repository.CartItemRepository;
import com.example.furniture.repository.OrderRepository;
import com.example.furniture.repository.ProductRepository;
import com.example.furniture.repository.ProductVariantRepository;
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
    @Autowired
    ProductVariantRepository productVariantRepository;

    @Transactional
    public OrderPreviewDTO placeOrder(String email) {
        try {
            Client client = clientService.getClient(email);
            Cart cart = client.getCart();
            List<CartItem> cartItems = cartItemRepository.findByCartWithVariant(cart);
            double subtotal = cartItems.stream().mapToDouble(CartItem::getCost).sum();
            LocalDateTime estimatedDate = LocalDateTime.now().plusDays(10);

            List<CartItemDTO> itemDTOs = cartItems.stream()
                    .map(item -> {
                        ProductVariant variant = item.getProductVariant();
                        Product product = variant.getProduct();
                        ProductDTO productDTO = new ProductDTO(product);
                        ProductVariantDTO variantDTO = new ProductVariantDTO(variant);
                        return new CartItemDTO(
                                item.getId(),
                                item.getComments(),
                                item.getQuantity(),
                                item.getCost(),
                                productDTO,
                                variantDTO
                        );
                    })
                    .collect(Collectors.toList());

            return new OrderPreviewDTO(itemDTOs, subtotal, estimatedDate.toLocalDate());
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

            // Fetch variants by SKUs or Variant IDs
            List<String> skus = request.getItems().stream()
                    .map(OrderProductVariantQuantity::getSku)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            List<ProductVariant> variants = new ArrayList<>();
            if (!skus.isEmpty()) {
                variants = productVariantRepository.findBySkuInWithDetails(skus);
            } else {
                List<Long> variantIds = request.getItems().stream()
                        .map(OrderProductVariantQuantity::getVariantId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                variants = productVariantRepository.findAllById(variantIds);
            }

            if (variants.isEmpty()) {
                return ResponseEntity.badRequest().body("لم يتم العثور على المتغيرات المطلوبة");
            }

            // Build lookup maps
            Map<String, ProductVariant> variantBySku = variants.stream()
                    .filter(v -> v.getSku() != null)
                    .collect(Collectors.toMap(ProductVariant::getSku, v -> v));
            Map<Long, ProductVariant> variantById = variants.stream()
                    .collect(Collectors.toMap(ProductVariant::getId, v -> v));

            Order order = new Order();
            order.setStatus("Pending");
            order.setAddress(request.getAddress());
            order.setOrderDate(LocalDateTime.now().toLocalDate());
            order.setEstimatedDeliveryDate(LocalDate.now().plusDays(10));
            order.setPaymentMethod(payment);

            List<OrderItem> orderItems = new ArrayList<>();
            double subtotal = 0.0;

            for (OrderProductVariantQuantity item : request.getItems()) {
                ProductVariant variant = null;

                // Prefer SKU, fallback to Variant ID
                if (item.getSku() != null) {
                    variant = variantBySku.get(item.getSku());
                } else if (item.getVariantId() != null) {
                    variant = variantById.get(item.getVariantId());
                }

                if (variant == null) {
                    return ResponseEntity.badRequest().body("المتغير غير موجود: " +
                            (item.getSku() != null ? item.getSku() : item.getVariantId()));
                }

                double price = variant.getEffectivePrice();
                double cost = price * item.getQuantity();

                OrderItem orderItem = new OrderItem();
                orderItem.setProductVariant(variant);
                orderItem.setQuantity(item.getQuantity());
                orderItem.setCost(cost);
                orderItem.setOrder(order);
                orderItems.add(orderItem);

                subtotal += cost;

                variant.setQuantitySailed(variant.getQuantitySailed() + item.getQuantity());
                variant.setQuantity(variant.getQuantity() - item.getQuantity());
                productVariantRepository.save(variant);
            }

            order.setItems(orderItems);
            order.setSubtotal(subtotal);

            if (request.getDeliveryCost() == 0) {
                List<Product> products = variants.stream().map(ProductVariant::getProduct).distinct().collect(Collectors.toList());
                if (!checkEligibilityForFreeDelivery(products)) {
                    throw new Exception("عذراً، لا يمكن تحميل هذا الطلب");
                }
            }
            order.setDeliveryCost(request.getDeliveryCost());
            order.setTotalCost(subtotal + order.getDeliveryCost());

            Client client;
            if (clientService.getClientByPhone(request.getPhone()).isPresent()) {
                client = clientService.getClientByPhone(request.getPhone()).get();
            } else {
                client = new Client();
                client.setName(request.getFirstName() + " " + request.getLastName());
                client.setPhone(request.getPhone());
                if (request.getEmail() != null && !request.getEmail().isBlank()) {
                    client.setEmail(request.getEmail());
                }
                client.setAddress(request.getAddress());
                client.setCart(new Cart());
                clientService.save(client);
            }
            order.setClient(client);

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
            return 350;
        else {
            return 550;
        }
    }

    @Transactional
    public List<Map<String, Object>> getSimplifiedOrdersView(String status) {
        List<Order> orders = orderRepository.findAllByStatus(status);
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

            List<String> productNames = order.getItems().stream()
                    .map(item -> {
                        ProductVariant variant = item.getProductVariant();
                        Product product = variant.getProduct();
                        return product.getName() + " x " + item.getQuantity() + " = " + item.getCost();
                    })
                    .collect(Collectors.toList());

            dto.put("productNames", productNames);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        Map<String, Object> dto = new HashMap<>();
        dto.put("clientName", order.getClient().getName());
        dto.put("clientPhone", order.getClient().getPhone());
        dto.put("deliveryAddress", order.getAddress());

        List<String> productNames = order.getItems().stream()
                .map(item -> {
                    ProductVariant variant = item.getProductVariant();
                    Product product = variant.getProduct();
                    return product.getCode() + " x " + item.getQuantity() + " = " + item.getCost();
                })
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

    @Transactional
    public boolean checkEligibilityForFreeDelivery(List<Product> items) {
        for (Product product : items) {
            if (!product.isFreeDelivery()) {
                return false;
            }
        }
        return true;
    }
}