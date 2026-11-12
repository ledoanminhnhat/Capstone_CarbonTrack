package com.carbontrack.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Khuôn dữ liệu cho khu quản trị (Admin).
 */
public class AdminDtos {

    // 1 dòng user trong bảng quản trị
    public record AdminUserView(
            String id,
            String name,
            String email,
            String role,
            long activityCount
    ) {}

    // Đổi role của 1 user
    public record UpdateRoleRequest(
            @NotBlank String role   // "USER" hoặc "ADMIN"
    ) {}
}
