package com.carbontrack.repository;

import com.carbontrack.model.Challenge;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ChallengeRepository extends MongoRepository<Challenge, String> {
    List<Challenge> findByActiveTrue();
    long count();

    Optional<Challenge> findFirstByActiveTrueAndMatchTypeAndMatchValue(String matchType, String matchValue);
}
