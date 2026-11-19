package com.carbontrack.repository;

import com.carbontrack.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    /** So khớp email không phân biệt hoa/thường (account cũ có thể lưu email có chữ hoa). */
    List<User> findAllByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
