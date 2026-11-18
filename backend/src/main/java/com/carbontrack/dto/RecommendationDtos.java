package com.carbontrack.dto;

import java.util.List;

public class RecommendationDtos {

    /** Tỉ trọng phát thải của 1 category (phần "Footprint Drivers"). */
    public record CategoryBreakdown(
            String category,
            double co2,          // kg CO2 của category
            double percent,      // % trên tổng
            String topSub,       // sub-category phát thải nhiều nhất trong category
            double topSubPercent // % của topSub trong category
    ) {}

    /** 1 gợi ý giảm phát thải, đã tính lượng tiết kiệm dựa trên dữ liệu thật. */
    public record Recommendation(
            String id,               // id của luật, vd "car-to-bus"
            String title,
            String description,
            String emoji,
            String category,
            String source,           // sub-category đang phát thải, vd "Car"
            double estimatedSavingKg,
            String difficulty,       // EASY / MEDIUM / HARD
            String challengeMatch,   // sub-category để đếm challenge, null nếu không áp dụng được
            int challengeTarget
    ) {}

    public record RecommendationResponse(
            String period,                    // "MM/yyyy" hoặc "ALL"
            double totalCo2,
            double totalPotentialSaving,
            List<CategoryBreakdown> breakdown,
            List<Recommendation> recommendations
    ) {}

    /** Kết quả khi biến 1 gợi ý thành challenge. */
    public record ApplyResponse(String challengeId, String title) {}
}
