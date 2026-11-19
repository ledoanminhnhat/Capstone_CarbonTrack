package com.carbontrack.service;

import com.carbontrack.model.User;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Theo dõi "đang online": mỗi request đã đăng nhập gọi touch(userId).
 * Để đỡ ghi DB liên tục, mỗi user chỉ ghi lastActiveAt tối đa 1 lần / phút.
 * Frontend coi là online nếu lastActiveAt trong vòng 5 phút.
 */
@Service
public class PresenceService {

    private static final Duration WRITE_INTERVAL = Duration.ofMinutes(1);

    private final MongoTemplate mongo;
    private final Map<String, Instant> lastWrite = new ConcurrentHashMap<>();

    public PresenceService(MongoTemplate mongo) {
        this.mongo = mongo;
    }

    public void touch(String userId) {
        Instant now = Instant.now();
        Instant prev = lastWrite.get(userId);
        if (prev != null && Duration.between(prev, now).compareTo(WRITE_INTERVAL) < 0) return;
        lastWrite.put(userId, now);
        try {
            mongo.updateFirst(new Query(Criteria.where("_id").is(userId)),
                    new Update().set("lastActiveAt", now), User.class);
        } catch (RuntimeException e) {
            lastWrite.remove(userId); // lỗi DB thì lần sau thử lại, không làm hỏng request
        }
    }
}
