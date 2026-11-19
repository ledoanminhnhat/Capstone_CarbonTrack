package com.carbontrack.config;

import com.carbontrack.model.HasId;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertCallback;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Trước khi lưu bất kỳ document nào: nếu chưa có id thì tự gán 1 UUID.
 * Nhờ vậy toàn hệ thống dùng UUID thay cho ObjectId mặc định của Mongo.
 */
@Component
public class IdGeneratorCallback implements BeforeConvertCallback<HasId> {

    @Override
    public HasId onBeforeConvert(HasId entity, String collection) {
        if (entity.getId() == null || entity.getId().isBlank()) {
            entity.setId(UUID.randomUUID().toString());
        }
        return entity;
    }
}
