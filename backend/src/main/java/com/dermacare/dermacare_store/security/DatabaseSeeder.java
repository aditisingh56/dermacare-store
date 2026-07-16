package com.dermacare.dermacare_store.security;

import com.dermacare.dermacare_store.entity.Role;
import com.dermacare.dermacare_store.entity.User;
import com.dermacare.dermacare_store.entity.Product;
import com.dermacare.dermacare_store.repository.RoleRepository;
import com.dermacare.dermacare_store.repository.UserRepository;
import com.dermacare.dermacare_store.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(RoleRepository roleRepository,
                          UserRepository userRepository,
                          ProductRepository productRepository,
                          PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Roles
        Role customerRole = roleRepository.findByRoleName("ROLE_CUSTOMER")
                .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_CUSTOMER")));

        Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_ADMIN")));

        // 2. Seed Users
        if (userRepository.findByEmail("customer@dermacare.com").isEmpty()) {
            User customer = new User();
            customer.setUsername("ThanushriAdi");
            customer.setEmail("customer@dermacare.com");
            customer.setPassword(passwordEncoder.encode("password"));
            customer.setRole(customerRole);
            userRepository.save(customer);
            System.out.println("Seeded default customer: customer@dermacare.com / password");
        }

        if (userRepository.findByEmail("admin@dermacare.com").isEmpty()) {
            User admin = new User();
            admin.setUsername("AdminUser");
            admin.setEmail("admin@dermacare.com");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setRole(adminRole);
            userRepository.save(admin);
            System.out.println("Seeded default admin: admin@dermacare.com / password");
        }

        // 3. Seed Products
        if (productRepository.count() == 0) {
            Product p1 = new Product();
            p1.setProductName("Vitamin C Face Serum");
            p1.setBrand("Minimalist");
            p1.setCategory("Serum");
            p1.setPrice(699.00);
            p1.setStock(50);
            p1.setDescription("Brightens skin tone, reduces pigmentation, and provides powerful antioxidant protection.");

            Product p2 = new Product();
            p2.setProductName("Niacinamide 10% Serum");
            p2.setBrand("The Derma Co");
            p2.setCategory("Serum");
            p2.setPrice(599.00);
            p2.setStock(40);
            p2.setDescription("Controls sebum production, minimizes pores, and fades acne marks.");

            Product p3 = new Product();
            p3.setProductName("Aqualogica SPF 50 Sunscreen");
            p3.setBrand("Aqualogica");
            p3.setCategory("Sunscreen");
            p3.setPrice(499.00);
            p3.setStock(30);
            p3.setDescription("Lightweight hydration with gel texture and high UV broad-spectrum shield protection.");

            Product p4 = new Product();
            p4.setProductName("Ceramide Barrier Cream");
            p4.setBrand("Re'equil");
            p4.setCategory("Moisturizer");
            p4.setPrice(799.00);
            p4.setStock(25);
            p4.setDescription("Deeply hydrates dry skin, repairs the protective skin barrier, and locks in moisture.");

            Product p5 = new Product();
            p5.setProductName("Salicylic Acid 2% Gel");
            p5.setBrand("Paula's Choice");
            p5.setCategory("Gel");
            p5.setPrice(999.00);
            p5.setStock(15);
            p5.setDescription("Exfoliates dead skin cells, clears blackheads, and treats active acne flare-ups.");

            Product p6 = new Product();
            p6.setProductName("Hyaluronic Acid Hydrator");
            p6.setBrand("L'Oreal");
            p6.setCategory("Moisturizer");
            p6.setPrice(649.00);
            p6.setStock(45);
            p6.setDescription("Plumps skin instantly and provides 24-hour intense multi-depth hydration.");

            productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6));
            System.out.println("Seeded default premium skincare products.");
        }
    }
}
