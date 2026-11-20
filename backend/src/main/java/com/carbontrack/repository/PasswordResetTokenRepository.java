package com.carbontrack.repository;

import com.carbontrack.model.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    // mã mới nhất của user (để chặn gửi mail liên tục)
    Optional<PasswordResetToken> findTopByUserIdOrderByCreatedAtDesc(String userId);

    void deleteByUserId(String userId);
}
