package com.carbontrack.controller;

import com.carbontrack.dto.AuthDtos.AuthResponse;
import com.carbontrack.dto.AuthDtos.GoogleLoginRequest;
import com.carbontrack.dto.AuthDtos.LoginRequest;
import com.carbontrack.dto.AuthDtos.RegisterRequest;
import com.carbontrack.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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
}
