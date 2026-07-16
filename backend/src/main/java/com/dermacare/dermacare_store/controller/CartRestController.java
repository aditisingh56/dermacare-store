package com.dermacare.dermacare_store.controller;

import com.dermacare.dermacare_store.entity.Cart;
import com.dermacare.dermacare_store.entity.Customer;
import com.dermacare.dermacare_store.entity.Product;
import com.dermacare.dermacare_store.repository.CustomerRepository;
import com.dermacare.dermacare_store.service.CartService;
import com.dermacare.dermacare_store.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartRestController {

    private final CartService cartService;
    private final ProductService productService;
    private final CustomerRepository customerRepository;

    public CartRestController(CartService cartService,
                              ProductService productService,
                              CustomerRepository customerRepository) {
        this.cartService = cartService;
        this.productService = productService;
        this.customerRepository = customerRepository;
    }

    // 1. GET ALL CART ITEMS
    @GetMapping
    public ResponseEntity<List<Cart>> getCartItems() {
        return ResponseEntity.ok(cartService.getAllCartItems());
    }

    // 2. ADD ITEM TO CART
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer productId = (Integer) payload.get("productId");
            int quantity = (int) payload.get("quantity");
            String customerName = (String) payload.get("customerName");

            Product product = productService.getProductById(productId);
            if (product == null) {
                throw new RuntimeException("Product not found");
            }

            // Find or create default customer for this session
            Customer customer = customerRepository.findAll().stream()
                    .filter(c -> c.getCustomerName().equalsIgnoreCase(customerName))
                    .findFirst()
                    .orElseGet(() -> {
                        Customer newCustomer = new Customer();
                        newCustomer.setCustomerName(customerName != null ? customerName : "ThanushriAdi");
                        newCustomer.setEmail("customer@dermacare.com");
                        newCustomer.setPhone("9876543267");
                        newCustomer.setAddress("Hyderabad, India");
                        return customerRepository.save(newCustomer);
                    });

            // Check if product already in cart
            List<Cart> existingCart = cartService.getAllCartItems();
            Cart cartItem = existingCart.stream()
                    .filter(item -> item.getCustomer().getCustomerId().equals(customer.getCustomerId())
                            && item.getProduct().getProductId().equals(product.getProductId()))
                    .findFirst()
                    .orElse(null);

            if (cartItem != null) {
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
                cartService.saveCart(cartItem);
            } else {
                cartItem = new Cart();
                cartItem.setCustomer(customer);
                cartItem.setProduct(product);
                cartItem.setQuantity(quantity);
                cartService.saveCart(cartItem);
            }

            response.put("success", true);
            response.put("message", "Product added to cart!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to add to cart: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // 3. DELETE ITEM FROM CART
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteCartItem(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            cartService.deleteCartItem(id);
            response.put("success", true);
            response.put("message", "Item removed from cart successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to remove item: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }
}
