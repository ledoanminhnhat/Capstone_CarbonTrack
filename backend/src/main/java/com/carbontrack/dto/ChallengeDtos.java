package com.carbontrack.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ChallengeDtos {

    /** Challenge kèm trạng thái của người dùng hiện tại (để frontend vẽ thẻ). */
    public record ChallengeView(
            String id,
            String title,
            String description,
            int points,
            int target,
            boolean joined,
            int progress,       // số lần đã đạt (tính tự động)
            String status,      // null nếu chưa join, "IN_PROGRESS" / "COMPLETED"
            String matchType,   // SUBCATEGORY / CATEGORY
            String matchValue   // Bus / Transport / ...
    ) {}

    /** Admin: challenge kèm thống kê tham gia. */
    public record AdminChallengeView(
            String id,
            String title,
            String description,
            int points,
            String matchType,
            String matchValue,
            int target,
            boolean active,
            int participants,   // số người đã tham gia
            int completed       // số người đã hoàn thành
    ) {}

    /** Admin: 1 người tham gia challenge + tiến độ. */
    public record Participant(
            String userId,
            String name,
            String avatarUrl,
            String joinedDate,  // ISO yyyy-MM-dd
            int progress,       // đã đạt bao nhiêu (tối đa = target)
            int target,
            String status       // IN_PROGRESS / COMPLETED
    ) {}

    /** Admin tạo challenge mới. */
    public record CreateChallengeRequest(
            @NotBlank String title,
            @NotBlank String description,
            @Min(1) int points,
            @NotBlank String matchType,   // "SUBCATEGORY" | "CATEGORY"
            @NotBlank String matchValue,
            @Min(1) int target
    ) {}
}
