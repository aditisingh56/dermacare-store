package com.dermacare.dermacare_store.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Connects to your React server safely
public class CustomerController {

    @GetMapping("/api/customer/dashboard")
    public ResponseEntity<Map<String, Object>> customerDashboard() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("role", "CUSTOMER");
        response.put("message", "Authorized access to customer store workspace granted.");
        
        return ResponseEntity.ok(response);
    }
}