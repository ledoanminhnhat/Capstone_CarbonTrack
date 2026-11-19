package com.carbontrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

/**
 * Dữ liệu frontend gửi lên khi ghi 1 hoạt động mới.
 * Backend sẽ tự tính ra lượng CO2 từ category + subCategory + amount.
 */
public record ActivityRequest(
        @NotBlank String category,     // Transport / Food / Energy / Shopping
        @NotBlank String subCategory,  // Car / Red Meat / Electricity ...
        @Positive double amount        // số km / kg / kWh / số món
) {}
