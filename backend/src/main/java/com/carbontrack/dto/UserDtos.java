package com.carbontrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Khuôn dữ liệu cho các API quản lý thông tin người dùng (Settings).
 */
public class UserDtos {

    // Thông tin trả về cho frontend
    public record UserProfile(
            String id,
            String name,
            String email,
            String role,
            int points
    ) {}

    // Đổi tên hiển thị
    public record UpdateProfileRequest(
            @NotBlank String name
    ) {}

    // Đổi mật khẩu
    public record ChangePasswordRequest(
            @NotBlank String currentPassword,
            @NotBlank @Size(min = 6, message = "Mật khẩu mới tối thiểu 6 ký tự") String newPassword
    ) {}
}
