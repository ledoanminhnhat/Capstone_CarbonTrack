package com.carbontrack.repository;

import com.carbontrack.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Interface truy vấn MongoDB cho Activity.
 * Chỉ cần khai báo, Spring Data tự sinh phần code CRUD (save, findById, findAll, delete...).
 */
public interface ActivityRepository extends MongoRepository<Activity, String> {

    // Spring tự hiểu tên hàm -> tự sinh query "tìm theo userId"
    List<Activity> findByUserId(String userId);

    long countByUserId(String userId);

    void deleteByUserId(String userId);
}
