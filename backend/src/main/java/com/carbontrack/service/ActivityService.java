package com.carbontrack.service;

import com.carbontrack.dto.ActivityRequest;
import com.carbontrack.model.Activity;
import com.carbontrack.repository.ActivityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

/**
 * Logic nghiệp vụ cho Activity. Mọi thao tác đều gắn với userId của người đang đăng nhập.
 */
@Service
public class ActivityService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ActivityRepository repository;
    private final EmissionService emissionService;

    public ActivityService(ActivityRepository repository, EmissionService emissionService) {
        this.repository = repository;
        this.emissionService = emissionService;
    }

    /** Lấy tất cả hoạt động của 1 người dùng, sắp theo NGÀY mới nhất trước. */
    public List<Activity> getByUserId(String userId) {
        return repository.findByUserId(userId).stream()
                // so sánh theo ngày thật (parse "dd/MM/yyyy"), mới nhất lên đầu
                .sorted(Comparator.comparing(
                        (Activity a) -> LocalDate.parse(a.getDate(), DATE_FMT)).reversed())
                .toList();
    }

    /** Ghi 1 hoạt động mới: tự tính CO2 rồi lưu. */
    public Activity log(String userId, ActivityRequest req) {
        Activity activity = emissionService.buildActivity(userId, req);
        return repository.save(activity);
    }

    /** Xóa 1 hoạt động - chỉ khi nó thuộc về đúng người dùng này. */
    public void delete(String userId, String id) {
        Activity activity = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found"));
        if (!userId.equals(activity.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your activity");
        }
        repository.deleteById(id);
    }
}
