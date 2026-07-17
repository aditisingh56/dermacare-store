package com.dermacare.dermacare_store.controller;

import com.dermacare.dermacare_store.entity.Product;
import com.dermacare.dermacare_store.entity.Order;
import com.dermacare.dermacare_store.repository.OrderRepository;
import com.dermacare.dermacare_store.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173") // Connects to your React server safely
public class ProductController {

    private final ProductService productService;
    private final OrderRepository orderRepository;

    public ProductController(ProductService productService, OrderRepository orderRepository) {
        this.productService = productService;
        this.orderRepository = orderRepository;
    }

    // 1. READ ALL - Fetches the 12 rows of skincare products for your grid view
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // 2. READ ONE - Used if someone goes to an update or details menu
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // 3. CREATE - Saves new products sent as JSON text from React forms
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveProduct(@RequestBody Product product) {
        productService.saveProduct(product);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product added successfully!");
        return ResponseEntity.ok(response);
    }

    // 4. UPDATE - Updates an existing product record
    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateProduct(@RequestBody Product product) {
        productService.saveProduct(product);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product updated successfully!");
        return ResponseEntity.ok(response);
    }

    // 5. DELETE - Deletes a product by ID from the database
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Find if there are any orders referencing this product
            List<Order> orders = orderRepository.findAll().stream()
                    .filter(o -> o.getProduct() != null && o.getProduct().getProductId().equals(id))
                    .toList();

            boolean hasPendingOrders = orders.stream()
                    .anyMatch(o -> o.getStatus().equalsIgnoreCase("Processing") || o.getStatus().equalsIgnoreCase("Shipped"));

            if (hasPendingOrders) {
                response.put("success", false);
                response.put("message", "Cannot delete product because it has active, undelivered orders (Processing or Shipped) that need to be completed.");
                return ResponseEntity.status(400).body(response);
            }

            if (!orders.isEmpty()) {
                response.put("success", false);
                response.put("message", "Cannot delete product because it has historical order records (Delivered or Cancelled). To make it unavailable to customers, please set its stock to 0.");
                return ResponseEntity.status(400).body(response);
            }

            productService.deleteProduct(id);

            response.put("success", true);
            response.put("message", "Product deleted successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to delete product: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }
}