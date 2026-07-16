package com.dermacare.dermacare_store.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.dermacare.dermacare_store.entity.User;
import com.dermacare.dermacare_store.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Process credentials and return user role to frontend dashboard
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginProcess(@RequestBody Map<String, String> loginRequest) {
        String emailInput = loginRequest.get("username"); // React maps email to username key
        String passwordInput = loginRequest.get("password");

        Map<String, Object> response = new HashMap<>();

        try {
            User user = userRepository.findByEmail(emailInput)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify password using BCrypt matches
            if (!passwordEncoder.matches(passwordInput, user.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }

            // Extract role (ROLE_CUSTOMER -> CUSTOMER, ROLE_ADMIN -> ADMIN)
            String rawRole = user.getRole().getRoleName();
            String role = rawRole.replace("ROLE_", "");

            response.put("success", true);
            response.put("role", role);
            response.put("username", user.getUsername());
            response.put("message", "Welcome back, " + user.getUsername() + "!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Invalid credentials. Please verify your email and security password.");
            return ResponseEntity.status(401).body(response);
        }
    }
}