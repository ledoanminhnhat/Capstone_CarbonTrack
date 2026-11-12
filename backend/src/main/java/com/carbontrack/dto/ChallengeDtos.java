package com.carbontrack.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ChallengeDtos {

    /** Challenge kèm trạng thái của người dùng hiện tại (để frontend vẽ thẻ). */
    public record ChallengeView(
            String id,
            String title,
            String description,
            String emoji,
            int points,
            int target,
            boolean joined,
            int progress,       // số lần đã đạt (tính tự động)
            String status,      // null nếu chưa join, "IN_PROGRESS" / "COMPLETED"
            String matchType,   // SUBCATEGORY / CATEGORY
            String matchValue   // Bus / Transport / ...
    ) {}

    /** Admin tạo challenge mới. */
    public record CreateChallengeRequest(
            @NotBlank String title,
            @NotBlank String description,
            @NotBlank String emoji,
            @Min(1) int points,
            @NotBlank String matchType,   // "SUBCATEGORY" | "CATEGORY"
            @NotBlank String matchValue,
            @Min(1) int target
    ) {}
}
