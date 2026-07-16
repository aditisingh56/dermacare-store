package com.dermacare.dermacare_store.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Connects to your React server safely
public class AdminController {

    @GetMapping("/api/admin/dashboard")
    public ResponseEntity<Map<String, Object>> adminDashboard() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("role", "ADMIN");
        response.put("message", "Authorized access to admin secure resource granted.");
        
        return ResponseEntity.ok(response);
    }
}