package com.carbontrack.repository;

import com.carbontrack.model.Challenge;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChallengeRepository extends MongoRepository<Challenge, String> {
    List<Challenge> findByActiveTrue();
    long count();
}
