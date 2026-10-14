package com.example.furniture.service;

import com.example.furniture.ENUMS.PaymentMethod;
import com.example.furniture.inputDTO.*;
import com.example.furniture.model.*;
import com.example.furniture.repository.CartItemRepository;
import com.example.furniture.repository.OrderRepository;
import com.example.furniture.repository.ProductRepository;
import com.example.furniture.repository.ProductVariantRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

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
        log.info("placeOrder: start for email={}", email);
        try {
            Client client = clientService.getClient(email);
            log.debug("placeOrder: client found id={}", client != null ? client.getId() : null);

            Cart cart = client.getCart();
            if (cart == null) {
                log.warn("placeOrder: client id={} has no cart", client.getId());
                return null;
            }

            List<CartItem> cartItems = cartItemRepository.findByCartWithVariant(cart);
            log.debug("placeOrder: cart id={} has {} item(s)", cart.getId(), cartItems.size());

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

            log.info("placeOrder: success for email={}, subtotal={}, items={}",
                    email, subtotal, itemDTOs.size());
            return new OrderPreviewDTO(itemDTOs, subtotal, estimatedDate.toLocalDate());
        } catch (Exception e) {
            log.error("placeOrder: failed for email={} -> {}", email, e.getMessage(), e);
            return null;
        }
    }

    @Transactional
    public ResponseEntity<?> confirmOrder(ConfirmOrderRequest request) {
        log.info("confirmOrder: start phone={}, email={}, itemsCount={}",
                request.getPhone(),
                request.getEmail(),
                request.getItems() != null ? request.getItems().size() : 0);

        try {
            PaymentMethod payment;
            try {
                payment = PaymentMethod.valueOf(request.getPaymentMethod());
                log.debug("confirmOrder: payment method parsed = {}", payment);
            } catch (IllegalArgumentException e) {
                log.warn("confirmOrder: invalid payment method = {}", request.getPaymentMethod());
                return ResponseEntity.badRequest().body("Invalid payment method");
            }

            if (request.getPhone() == null || !request.getPhone().matches("^01[0-9]{9}$")) {
                log.warn("confirmOrder: invalid phone = {}", request.getPhone());
                return ResponseEntity.badRequest().body("Invalid phone number, must be 11 digits starting with 01");
            }
            if (request.getEmail() != null && !request.getEmail().isBlank()) {
                if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                    log.warn("confirmOrder: invalid email = {}", request.getEmail());
                    return ResponseEntity.badRequest().body("Invalid email address");
                }
            }

            if (request.getItems() == null || request.getItems().isEmpty()) {
                log.warn("confirmOrder: empty items list");
                return ResponseEntity.badRequest().body("Items list is empty");
            }

            // Fetch variants by SKUs or Variant IDs
            List<String> skus = request.getItems().stream()
                    .map(OrderProductVariantQuantity::getSku)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            log.debug("confirmOrder: looking up variants by skus={}", skus);

            List<ProductVariant> variants = new ArrayList<>();
            if (!skus.isEmpty()) {
                variants = productVariantRepository.findBySkuInWithDetails(skus);
                log.debug("confirmOrder: found {} variant(s) by SKU", variants.size());
            } else {
                List<Long> variantIds = request.getItems().stream()
                        .map(OrderProductVariantQuantity::getVariantId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                log.debug("confirmOrder: looking up variants by ids={}", variantIds);
                variants = productVariantRepository.findAllById(variantIds);
                log.debug("confirmOrder: found {} variant(s) by ID", variants.size());
            }

            if (variants.isEmpty()) {
                log.warn("confirmOrder: no variants found for request");
                return ResponseEntity.badRequest().body("Requested variants were not found");
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
                    log.warn("confirmOrder: variant not found for sku={} / variantId={}",
                            item.getSku(), item.getVariantId());
                    return ResponseEntity.badRequest().body("Variant not found: " +
                            (item.getSku() != null ? item.getSku() : item.getVariantId()));
                }

                log.debug("confirmOrder: processing variant id={} sku={} requestedQty={} stockQty={}",
                        variant.getId(), variant.getSku(), item.getQuantity(), variant.getQuantity());

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
            log.debug("confirmOrder: subtotal computed = {}", subtotal);

            if (request.getDeliveryCost() == 0) {
                List<Product> products = variants.stream()
                        .map(ProductVariant::getProduct)
                        .distinct()
                        .collect(Collectors.toList());
                if (!checkEligibilityForFreeDelivery(products)) {
                    log.warn("confirmOrder: free delivery not eligible for products={}",
                            products.stream().map(Product::getId).collect(Collectors.toList()));
                    throw new Exception("Sorry, this order is not eligible for free delivery");
                }
            }
            order.setDeliveryCost(request.getDeliveryCost());
            order.setTotalCost(subtotal + order.getDeliveryCost());

            Client client;
            Optional<Client> existingClient = clientService.getClientByPhone(request.getPhone());
            if (existingClient.isPresent()) {
                client = existingClient.get();
                log.debug("confirmOrder: reusing existing client id={}", client.getId());
            } else {
                client = new Client();
                client.setName(request.getFirstName() + " " + request.getLastName());
                client.setPhone(request.getPhone());
                if (request.getEmail() != null && !request.getEmail().isBlank()) {
                    client.setEmail(request.getEmail());
                }
                client.setAddress(request.getAddress());
                client.setCart(new Cart());
                client.setPassword("pass");
                clientService.save(client);
                log.debug("confirmOrder: created new client id={}", client.getId());
            }
            order.setClient(client);

            orderRepository.save(order);
            log.info("confirmOrder: success, order id={}, total={}",
                    order.getId(), order.getTotalCost());
            return ResponseEntity.ok("Order confirmed successfully");

        } catch (NoSuchElementException e) {
            log.error("confirmOrder: NoSuchElementException -> {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Product not found");
        } catch (DataIntegrityViolationException e) {
            log.error("confirmOrder: DataIntegrityViolationException -> {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Data error, phone or email may already be registered");
        } catch (Exception e) {
            log.error("confirmOrder: unexpected error -> {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("An unexpected error occurred, please try again later");
        }
    }

    public double calculateDeliveryCost(Address address) {
        log.debug("calculateDeliveryCost: city={}", address != null ? address.getCity() : null);
        if (address.getCity().equals("القاهرة") || address.getCity().equals("الجيزة"))
            return 350;
        else {
            return 550;
        }
    }

    @Transactional
    public List<Map<String, Object>> getSimplifiedOrdersView(String status) {
        log.info("getSimplifiedOrdersView: status={}", status);
        List<Order> orders = orderRepository.findAllByStatus(status);
        log.debug("getSimplifiedOrdersView: found {} order(s)", orders.size());

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
        log.info("getOrder: orderId={}", orderId);
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            log.warn("getOrder: order id={} not found", orderId);
            return null;
        }

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

        log.debug("getOrder: returning dto for order id={}", orderId);
        return dto;
    }

    @Transactional
    public String updateStatus(Long orderId, String status) {
        log.info("updateStatus: orderId={}, newStatus={}", orderId, status);
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            log.warn("updateStatus: order id={} not found", orderId);
            return "error";
        }
        order.setStatus(status);
        orderRepository.save(order);
        log.info("updateStatus: order id={} updated to status={}", orderId, status);
        return "success";
    }

    @Transactional
    public boolean checkEligibilityForFreeDelivery(List<Product> items) {
        log.debug("checkEligibilityForFreeDelivery: checking {} product(s)", items.size());
        for (Product product : items) {
            if (!product.isFreeDelivery()) {
                log.debug("checkEligibilityForFreeDelivery: product id={} is not free delivery",
                        product.getId());
                return false;
            }
        }
        log.debug("checkEligibilityForFreeDelivery: all products eligible");
        return true;
    }
}