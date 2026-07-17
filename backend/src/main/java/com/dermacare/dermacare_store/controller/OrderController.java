package com.dermacare.dermacare_store.controller;

import com.dermacare.dermacare_store.entity.Customer;
import com.dermacare.dermacare_store.entity.Order;
import com.dermacare.dermacare_store.entity.Product;
import com.dermacare.dermacare_store.repository.CustomerRepository;
import com.dermacare.dermacare_store.repository.ProductRepository;
import com.dermacare.dermacare_store.service.CartService;
import com.dermacare.dermacare_store.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173") // Connects to your React server safely
public class OrderController {

    private final OrderService orderService;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    public OrderController(OrderService orderService,
                           CustomerRepository customerRepository,
                           ProductRepository productRepository,
                           CartService cartService) {
        this.orderService = orderService;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.cartService = cartService;
    }

    // 1. READ ALL - Fetches past checkout records to display in user order logs (filtered by username if present)
    @GetMapping
    public ResponseEntity<List<Order>> viewOrders(@RequestParam(required = false) String username) {
        if (username != null && !username.trim().isEmpty()) {
            List<Order> filtered = orderService.getAllOrders().stream()
                    .filter(o -> o.getCustomer() != null && 
                            (username.equalsIgnoreCase(o.getCustomer().getCustomerName()) || 
                             username.equalsIgnoreCase(o.getCustomer().getEmail())))
                    .toList();
            return ResponseEntity.ok(filtered);
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // 2. PLACE ORDER - Processes checkout details from the React cart layout
    @PostMapping("/place")
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();

        try {
            String customerName = (String) payload.get("customerName");
            String email = (String) payload.get("email");
            String phone = (String) payload.get("phone");
            String address = (String) payload.get("address");

            // Find or create customer
            Customer customer = customerRepository.findByEmail(email)
                    .orElseGet(() -> {
                        Customer c = new Customer();
                        c.setCustomerName(customerName);
                        c.setEmail(email);
                        c.setPhone(phone);
                        c.setAddress(address);
                        return customerRepository.save(c);
                    });

            // Update customer details if they changed
            if (!customer.getCustomerName().equals(customerName) || !customer.getAddress().equals(address)) {
                customer.setCustomerName(customerName);
                customer.setAddress(address);
                customer.setPhone(phone);
                customerRepository.save(customer);
            }

            List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
            if (items == null || items.isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

            for (Map<String, Object> itemMap : items) {
                // Parse product name from nested maps
                Map<String, Object> productMap = (Map<String, Object>) itemMap.get("product");
                String prodName = null;
                if (productMap != null) {
                    prodName = (String) productMap.get("productName");
                    if (prodName == null) {
                        prodName = (String) productMap.get("product_name");
                    }
                }
                if (prodName == null) {
                    prodName = (String) itemMap.get("product_name");
                }

                if (prodName == null) {
                    throw new RuntimeException("Product details are missing in cart payload.");
                }

                // Query product from database
                Product product = productRepository.findAll().stream()
                        .filter(p -> p.getProductName().equalsIgnoreCase(productMap.get("productName") != null ? (String)productMap.get("productName") : (String)productMap.get("product_name")))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Product not found: " + productMap.get("productName")));

                int quantity = ((Number) itemMap.get("quantity")).intValue();

                // Validate and update stock
                if (product.getStock() < quantity) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getProductName());
                }
                product.setStock(product.getStock() - quantity);
                productRepository.save(product);

                // Create Order record
                Order order = new Order();
                order.setCustomer(customer);
                order.setProduct(product);
                order.setQuantity(quantity);
                order.setTotalPrice(product.getPrice() * quantity);
                order.setOrderDate(LocalDate.now());
                order.setStatus("Processing");

                orderService.saveOrder(order);

                // Remove from Cart
                Object cartIdObj = itemMap.get("cartId");
                if (cartIdObj != null) {
                    Integer cartId = ((Number) cartIdObj).intValue();
                    try {
                        cartService.deleteCartItem(cartId);
                    } catch (Exception e) {
                        // Ignore if cart was already cleared or not stored in DB
                    }
                }
            }

            response.put("success", true);
            response.put("message", "Order placed successfully! Thank you for shopping with DermaCare.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to process order: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // 3. CANCEL ORDER - Marks order status as Cancelled and restores stock
    @PutMapping("/cancel/{id}")
    public ResponseEntity<Map<String, Object>> cancelOrder(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Find order
            Order order = orderService.getAllOrders().stream()
                    .filter(o -> o.getOrderId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if (order.getStatus().equalsIgnoreCase("Cancelled")) {
                throw new RuntimeException("Order is already cancelled");
            }

            // Restore product stock
            Product product = order.getProduct();
            if (product != null) {
                product.setStock(product.getStock() + order.getQuantity());
                productRepository.save(product);
            }

            // Mark status
            order.setStatus("Cancelled");
            orderService.saveOrder(order);

            response.put("success", true);
            response.put("message", "Order cancelled successfully and product inventory restored!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to cancel order: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // 4. UPDATE ORDER STATUS - Allows admin to transition order status and manage stock corrections
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();
        try {
            Order order = orderService.getAllOrders().stream()
                    .filter(o -> o.getOrderId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            String newStatus = payload.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                throw new RuntimeException("Status field is required");
            }

            String oldStatus = order.getStatus();
            if (!oldStatus.equalsIgnoreCase(newStatus)) {
                // If transitioning to Cancelled, restore stock
                if (newStatus.equalsIgnoreCase("Cancelled")) {
                    Product product = order.getProduct();
                    if (product != null) {
                        product.setStock(product.getStock() + order.getQuantity());
                        productRepository.save(product);
                    }
                }
                // If transitioning FROM Cancelled to something else, deduct stock (check availability)
                else if (oldStatus.equalsIgnoreCase("Cancelled")) {
                    Product product = order.getProduct();
                    if (product != null) {
                        if (product.getStock() < order.getQuantity()) {
                            throw new RuntimeException("Insufficient stock to reinstate order");
                        }
                        product.setStock(product.getStock() - order.getQuantity());
                        productRepository.save(product);
                    }
                }
                order.setStatus(newStatus);
                orderService.saveOrder(order);
            }

            response.put("success", true);
            response.put("message", "Order status updated successfully to " + newStatus);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update status: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }
}