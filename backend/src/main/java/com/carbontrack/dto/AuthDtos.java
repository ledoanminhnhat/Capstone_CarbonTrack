package com.carbontrack.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Gom các "khuôn dữ liệu" cho API auth vào 1 file cho gọn.
 */
public class AuthDtos {

    // Dữ liệu client gửi lên khi đăng ký
    public record RegisterRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            @NotBlank @Size(min = 6, message = "Mật khẩu tối thiểu 6 ký tự") String password
    ) {}

    // Dữ liệu client gửi lên khi đăng nhập
    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {}

    // Dữ liệu backend trả về sau khi đăng nhập/đăng ký thành công
    public record AuthResponse(
            String token,
            String id,
            String name,
            String email,
            String role,
            String avatarUrl
    ) {}
}
