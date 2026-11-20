package com.carbontrack.controller;

import com.carbontrack.dto.AuthDtos.AuthResponse;
import com.carbontrack.dto.AuthDtos.ForgotPasswordRequest;
import com.carbontrack.dto.AuthDtos.GoogleLoginRequest;
import com.carbontrack.dto.AuthDtos.LoginRequest;
import com.carbontrack.dto.AuthDtos.RegisterRequest;
import com.carbontrack.dto.AuthDtos.ResetPasswordRequest;
import com.carbontrack.service.AuthService;
import com.carbontrack.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/google")
    public AuthResponse google(@Valid @RequestBody GoogleLoginRequest request) {
        return authService.loginWithGoogle(request.accessToken());
    }

    // ----- Quên mật khẩu -----

    // Luôn trả lời giống nhau dù email có tài khoản hay không (không để lộ email đã đăng ký)
    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestReset(request.email());
        return Map.of("message", "If an account exists for that email, we've sent a reset link.");
    }

    // Trang reset gọi trước để báo sớm nếu link hết hạn / không hợp lệ
    @GetMapping("/reset-password/validate")
    public ResponseEntity<Void> validateResetToken(@RequestParam String token) {
        passwordResetService.validate(token);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.token(), request.password());
        return ResponseEntity.noContent().build();
    }
}
