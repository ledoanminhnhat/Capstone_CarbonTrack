package com.carbontrack.config;

import java.time.Instant;
import com.carbontrack.model.User;
import com.carbontrack.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Chạy 1 lần khi app khởi động: nếu chưa có admin thì tạo tài khoản admin mặc định.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL = "admin@carbontrack.com";
    private static final String ADMIN_PASSWORD = "Admin@123"; // đổi sau khi cần

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail(ADMIN_EMAIL)) {
            User admin = new User();
            admin.setName("Administrator");
            admin.setEmail(ADMIN_EMAIL);
            admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            admin.setRole("ADMIN");
            admin.setCreatedAt(Instant.now());
            userRepository.save(admin);
            System.out.println(">>> Seeded ADMIN account: " + ADMIN_EMAIL + " / " + ADMIN_PASSWORD);
        }
    }
}
