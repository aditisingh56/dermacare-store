package com.dermacare.dermacare_store.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Connects to your React server safely
public class HomeController {

    @GetMapping("/api")
    public ResponseEntity<Map<String, Object>> homeApiHealthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Welcome to the DermaCare Store REST API Backend Server.");
        response.put("databaseConnected", true);
        
        return ResponseEntity.ok(response);
    }
}