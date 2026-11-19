package com.carbontrack.repository;

import com.carbontrack.model.UserChallenge;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserChallengeRepository extends MongoRepository<UserChallenge, String> {
    List<UserChallenge> findByUserId(String userId);
    Optional<UserChallenge> findByUserIdAndChallengeId(String userId, String challengeId);
    void deleteByChallengeId(String challengeId);
}
