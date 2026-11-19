package com.carbontrack.service;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import com.carbontrack.dto.AuthDtos.AuthResponse;
import com.carbontrack.dto.AuthDtos.LoginRequest;
import com.carbontrack.dto.AuthDtos.RegisterRequest;
import com.carbontrack.model.User;
import com.carbontrack.repository.UserRepository;
import com.carbontrack.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GoogleAuthService googleAuthService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       GoogleAuthService googleAuthService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleAuthService = googleAuthService;
    }

    public AuthResponse register(RegisterRequest req) {
        String email = normalize(req.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được đăng ký");
        }

        User user = new User();
        user.setName(req.name());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(req.password())); // hash mật khẩu
        user.setRole("USER"); // đăng ký qua web luôn là USER
        user.setCreatedAt(Instant.now());

        User saved = userRepository.save(user);
        return buildResponse(saved);
    }

    public AuthResponse login(LoginRequest req) {
        User user = findByEmail(req.email())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng"));

        // tài khoản tạo bằng Google chưa đặt mật khẩu → chỉ đăng nhập được bằng Google
        if (user.getPassword() == null || !passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng");
        }

        return buildResponse(user);
    }

    /**
     * Đăng nhập bằng Google. Email đã có tài khoản → liên kết (lưu googleId) và đăng nhập;
     * chưa có → tạo user USER mới, không có mật khẩu, lấy tên + ảnh từ Google.
     */
    public AuthResponse loginWithGoogle(String accessToken) {
        GoogleAuthService.GoogleUser g = googleAuthService.verify(accessToken);

        User user = findByEmail(g.email()).orElseGet(() -> {
            User u = new User();
            u.setName(g.name() != null ? g.name() : g.email());
            u.setEmail(g.email());
            u.setRole("USER");
            u.setAvatarUrl(g.picture());
            u.setCreatedAt(Instant.now());
            return u;
        });

        // Lần đầu liên kết Google: lưu googleId; account cũ chưa có avatar thì lấy ảnh Google (có rồi thì giữ nguyên)
        if (user.getGoogleId() == null) {
            user.setGoogleId(g.sub());
            if (user.getAvatarUrl() == null) {
                user.setAvatarUrl(g.picture());
            }
            user = userRepository.save(user);
        }
        return buildResponse(user);
    }

    /** Email lưu mới luôn ở dạng chữ thường, bỏ khoảng trắng thừa. */
    private static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    /**
     * Tìm user theo email, không phân biệt hoa/thường (account cũ có thể lưu email có chữ hoa).
     * Nếu DB lỡ có 2 account chỉ khác hoa/thường → báo lỗi, không tự chọn 1 trong 2.
     */
    private Optional<User> findByEmail(String email) {
        List<User> matches = userRepository.findAllByEmailIgnoreCase(normalize(email));
        if (matches.size() > 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Có nhiều tài khoản trùng email này, vui lòng liên hệ admin");
        }
        return matches.stream().findFirst();
    }

    private AuthResponse buildResponse(User user) {
        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getId());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(),
                user.getAvatarUrl());
    }
}
