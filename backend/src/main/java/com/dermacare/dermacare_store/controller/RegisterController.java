package com.dermacare.dermacare_store.controller;

import com.dermacare.dermacare_store.entity.Role;
import com.dermacare.dermacare_store.entity.User;
import com.dermacare.dermacare_store.repository.RoleRepository;
import com.dermacare.dermacare_store.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Connects to your React server safely
public class RegisterController {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterController(UserService userService,
                              RoleRepository roleRepository,
                              PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. Remove the @GetMapping("/register") because React handles loading its own sign-up views now!

    // 2. Process incoming JSON data packets directly from the React sign-up form
    @PostMapping("/api/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Fetch default customer registration role from database
            Role role = roleRepository.findByRoleName("ROLE_CUSTOMER")
                    .orElseThrow(() -> new RuntimeException("Default registration role not configured in database."));

            // Inject role metadata and process secure password hashing
            user.setRole(role);
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // Write record permanently to your local MySQL instance
            userService.saveUser(user);

            response.put("success", true);
            response.put("message", "Account created successfully! Redirecting to login page...");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }
}