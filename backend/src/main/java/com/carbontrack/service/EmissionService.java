package com.carbontrack.service;

import com.carbontrack.dto.ActivityRequest;
import com.carbontrack.model.Activity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * Tính lượng CO2 phát thải từ hoạt động của người dùng, dựa trên "hệ số phát thải"
 * (emission factor = kg CO2 trên mỗi đơn vị). Đây là phần logic lõi của app.
 */
@Service
public class EmissionService {

    // Hệ số phát thải cho từng sub-category
    private record Factor(double co2PerUnit, String unit) {}

    private static final Map<String, Factor> FACTORS = Map.ofEntries(
            // Transport - trên mỗi km
            Map.entry("Motorbike",   new Factor(0.10, "km")),
            Map.entry("Car",         new Factor(0.20, "km")),
            Map.entry("Bus",         new Factor(0.08, "km")),
            Map.entry("Plane",       new Factor(0.25, "km")),
            // Food - trên mỗi kg
            Map.entry("Red Meat",    new Factor(27.0, "kg")),
            Map.entry("White Meat",  new Factor(6.0, "kg")),
            Map.entry("Vegetarian",  new Factor(2.0, "kg")),
            // Energy
            Map.entry("Electricity", new Factor(0.5, "kWh")),
            Map.entry("Gas",         new Factor(2.0, "m3")),
            Map.entry("Water",       new Factor(0.3, "m3")),
            // Shopping - trên mỗi món
            Map.entry("Clothing",    new Factor(10.0, "item")),
            Map.entry("Electronics", new Factor(60.0, "item")),
            Map.entry("Furniture",   new Factor(40.0, "item"))
    );

    // Ngưỡng đánh dấu "High": từ 5 kg CO2 trở lên
    private static final double HIGH_THRESHOLD = 5.0;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /** Dựng 1 Activity hoàn chỉnh (đã tính CO2) từ dữ liệu người dùng nhập. */
    public Activity buildActivity(String userId, ActivityRequest req) {
        Factor factor = FACTORS.get(req.subCategory());
        if (factor == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Unknown sub-category: " + req.subCategory());
        }

        double co2 = Math.round(factor.co2PerUnit() * req.amount() * 100.0) / 100.0;
        String detail = trimNumber(req.amount()) + " " + factor.unit();
        String status = co2 >= HIGH_THRESHOLD ? "High" : "Low";

        Activity activity = new Activity();
        activity.setUserId(userId);
        activity.setDate(LocalDate.now().format(DATE_FMT));
        activity.setActivity(req.subCategory());
        activity.setDetail(detail);
        activity.setCo2(co2);
        activity.setCategory(req.category());
        activity.setStatus(status);
        return activity;
    }

    // 25.0 -> "25", 1.5 -> "1.5" (bỏ phần .0 cho đẹp)
    private String trimNumber(double value) {
        if (value == Math.floor(value)) {
            return String.valueOf((long) value);
        }
        return String.valueOf(value);
    }
}
