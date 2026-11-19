package com.carbontrack.service;

import com.carbontrack.dto.RecommendationDtos.*;
import com.carbontrack.model.Activity;
import com.carbontrack.model.Challenge;
import com.carbontrack.repository.ActivityRepository;
import com.carbontrack.repository.ChallengeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Gợi ý giảm phát thải theo LUẬT (rule-based).
 * Mỗi luật: "đang làm X" -> "đổi sang Y", lượng tiết kiệm = CO2 của X × tỉ lệ giảm.
 * Tỉ lệ giảm suy ra từ hệ số trong EmissionService, ví dụ Car 0.20/km -> Bus 0.08/km = giảm 60%.
 */
@Service
public class RecommendationService {

    private record Rule(
            String id, String source, String title, String description,
            double reduction,        // phần CO2 của source tiết kiệm được (0..1)
            String difficulty,
            String challengeMatch,   // sub-category để đếm challenge (null = không có)
            int challengeTarget,
            int challengePoints
    ) {}

    private static final List<Rule> RULES = List.of(
            // Transport
            new Rule("car-to-bus", "Car", "Take the bus instead of driving",
                    "Bus emits 0.08 kg/km vs 0.20 kg/km by car. Switch half of your car trips.",
                    0.5 * (1 - 0.08 / 0.20), "MEDIUM", "Bus", 5, 50),
            new Rule("motorbike-to-bus", "Motorbike", "Ride the bus for some commutes",
                    "Bus emits 0.08 kg/km vs 0.10 kg/km by motorbike. Try it for half your trips.",
                    0.5 * (1 - 0.08 / 0.10), "EASY", "Bus", 5, 30),
            new Rule("fewer-flights", "Plane", "Cut one short-haul flight",
                    "Flying is the most carbon-intensive way to travel. Replace short flights with coach or train.",
                    0.3 * (1 - 0.08 / 0.25), "HARD", "Bus", 3, 40),
            // Food
            new Rule("red-to-veg", "Red Meat", "Swap red meat for vegetarian meals",
                    "Red meat emits 27 kg CO₂ per kg, vegetarian food only 2 kg. Swap half of it.",
                    0.5 * (1 - 2.0 / 27.0), "MEDIUM", "Vegetarian", 5, 50),
            new Rule("red-to-white", "Red Meat", "Choose chicken or fish over beef",
                    "White meat emits 6 kg CO₂ per kg vs 27 kg for red meat.",
                    0.5 * (1 - 6.0 / 27.0), "EASY", "White Meat", 5, 30),
            new Rule("white-to-veg", "White Meat", "Add meat-free days",
                    "Vegetarian food emits 2 kg CO₂ per kg vs 6 kg for white meat.",
                    0.5 * (1 - 2.0 / 6.0), "EASY", "Vegetarian", 5, 30),
            // Energy
            new Rule("save-electricity", "Electricity", "Cut standby power & switch to LED",
                    "Unplug idle devices, use LED bulbs and set the AC to 26°C to save ~15% electricity.",
                    0.15, "EASY", null, 0, 0),
            new Rule("save-gas", "Gas", "Cook and heat more efficiently",
                    "Use lids on pots and turn down heating 1°C to save ~10% gas.",
                    0.10, "EASY", null, 0, 0),
            new Rule("save-water", "Water", "Take shorter showers",
                    "Cutting shower time by a few minutes saves ~20% water and the energy to pump it.",
                    0.20, "EASY", null, 0, 0),
            // Shopping
            new Rule("secondhand-clothes", "Clothing", "Buy second-hand clothes",
                    "Second-hand or repaired clothing avoids most of the production emissions.",
                    0.5, "EASY", null, 0, 0),
            new Rule("repair-electronics", "Electronics", "Repair or buy refurbished electronics",
                    "Making a new device emits ~60 kg CO₂. Keeping it longer is the biggest win.",
                    0.5, "MEDIUM", null, 0, 0),
            new Rule("secondhand-furniture", "Furniture", "Choose second-hand furniture",
                    "Pre-owned furniture avoids ~40 kg CO₂ per item.",
                    0.5, "MEDIUM", null, 0, 0)
    );

    private final ActivityRepository activityRepo;
    private final ChallengeRepository challengeRepo;
    private final ChallengeService challengeService;

    public RecommendationService(ActivityRepository activityRepo,
                                 ChallengeRepository challengeRepo,
                                 ChallengeService challengeService) {
        this.activityRepo = activityRepo;
        this.challengeRepo = challengeRepo;
        this.challengeService = challengeService;
    }

    /** @param month "MM/yyyy" để lọc theo tháng, null/blank = toàn bộ. */
    public RecommendationResponse forUser(String userId, String month) {
        boolean all = month == null || month.isBlank();
        List<Activity> acts = activityRepo.findByUserId(userId).stream()
                .filter(a -> all || (a.getDate() != null && a.getDate().endsWith("/" + month)))
                .toList();

        double total = acts.stream().mapToDouble(Activity::getCo2).sum();

        // CO2 theo sub-category và theo category
        Map<String, Double> bySub = acts.stream().collect(
                Collectors.groupingBy(Activity::getActivity, Collectors.summingDouble(Activity::getCo2)));
        Map<String, List<Activity>> byCat = acts.stream()
                .collect(Collectors.groupingBy(Activity::getCategory));

        List<CategoryBreakdown> breakdown = byCat.entrySet().stream().map(e -> {
            double catCo2 = e.getValue().stream().mapToDouble(Activity::getCo2).sum();
            Map.Entry<String, Double> top = e.getValue().stream()
                    .collect(Collectors.groupingBy(Activity::getActivity,
                            Collectors.summingDouble(Activity::getCo2)))
                    .entrySet().stream().max(Map.Entry.comparingByValue()).orElseThrow();
            return new CategoryBreakdown(e.getKey(), round(catCo2), pct(catCo2, total),
                    top.getKey(), pct(top.getValue(), catCo2));
        }).sorted(Comparator.comparingDouble(CategoryBreakdown::co2).reversed()).toList();

        // Áp luật: chỉ những luật mà user thực sự có phát thải ở source
        List<Recommendation> recs = RULES.stream()
                .filter(r -> bySub.getOrDefault(r.source(), 0.0) > 0)
                .map(r -> toDto(r, bySub.get(r.source()) * r.reduction()))
                .sorted(Comparator.comparingDouble(Recommendation::estimatedSavingKg).reversed())
                .toList();

        double potential = recs.stream()
                // 2 luật cùng source (vd red-to-veg & red-to-white) không cộng dồn: lấy luật lớn nhất
                .collect(Collectors.toMap(Recommendation::source,
                        Recommendation::estimatedSavingKg, Math::max))
                .values().stream().mapToDouble(Double::doubleValue).sum();

        return new RecommendationResponse(all ? "ALL" : month, round(total), round(potential),
                breakdown, recs);
    }

    /** Biến 1 gợi ý thành challenge: dùng lại challenge sẵn có nếu cùng luật đếm, không thì tạo mới; rồi join. */
    public ApplyResponse apply(String userId, String ruleId) {
        Rule r = RULES.stream().filter(x -> x.id().equals(ruleId)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recommendation not found"));
        if (r.challengeMatch() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "This recommendation cannot be tracked as a challenge");
        }

        Challenge ch = challengeRepo
                .findFirstByActiveTrueAndMatchTypeAndMatchValue("SUBCATEGORY", r.challengeMatch())
                .orElseGet(() -> challengeRepo.save(new Challenge(null,
                        "Log " + r.challengeTarget() + " " + r.challengeMatch() + " activities",
                        r.title(), r.challengePoints(),
                        "SUBCATEGORY", r.challengeMatch(), r.challengeTarget(), true)));

        challengeService.join(userId, ch.getId()); // idempotent
        return new ApplyResponse(ch.getId(), ch.getTitle());
    }

    private Recommendation toDto(Rule r, double saving) {
        return new Recommendation(r.id(), r.title(), r.description(),
                categoryOf(r.source()), r.source(), round(saving), r.difficulty(),
                r.challengeMatch(), r.challengeTarget());
    }

    private static String categoryOf(String sub) {
        return switch (sub) {
            case "Car", "Motorbike", "Bus", "Plane" -> "Transport";
            case "Red Meat", "White Meat", "Vegetarian" -> "Food";
            case "Electricity", "Gas", "Water" -> "Energy";
            default -> "Shopping";
        };
    }

    private static double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    private static double pct(double part, double whole) {
        return whole <= 0 ? 0 : Math.round(part / whole * 1000.0) / 10.0;
    }
}
