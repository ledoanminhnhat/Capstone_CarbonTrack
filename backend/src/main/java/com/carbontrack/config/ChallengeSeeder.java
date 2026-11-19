package com.carbontrack.config;

import com.carbontrack.model.Challenge;
import com.carbontrack.repository.ChallengeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seed vài challenge mẫu (dạng auto-đếm) khi kho còn trống.
 */
@Component
@Order(2)
public class ChallengeSeeder implements CommandLineRunner {

    private final ChallengeRepository repository;

    public ChallengeSeeder(ChallengeRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        repository.saveAll(List.of(
                new Challenge(null, "Take the bus 5 times",
                        "Log 5 bus trips to cut your transport emissions.",
                        500, "SUBCATEGORY", "Bus", 5, true),
                new Challenge(null, "Go vegetarian 3 times",
                        "Log 3 vegetarian meals this challenge.",
                        300, "SUBCATEGORY", "Vegetarian", 3, true),
                new Challenge(null, "Track transport 4 times",
                        "Log any 4 transport activities and stay aware of your travel footprint.",
                        400, "CATEGORY", "Transport", 4, true),
                new Challenge(null, "Save water 3 times",
                        "Track your water usage 3 times to stay mindful.",
                        200, "SUBCATEGORY", "Water", 3, true)
        ));
        System.out.println(">>> Seeded sample challenges");
    }
}
