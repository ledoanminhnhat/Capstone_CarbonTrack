package com.carbontrack.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

/**
 * Xác minh access token Google (frontend lấy qua Google Identity Services).
 * 1) tokeninfo: kiểm tra token còn hạn + được cấp cho đúng Client ID của app (chống dùng token của app khác).
 * 2) userinfo: lấy email, tên, ảnh.
 */
@Service
public class GoogleAuthService {

    public record GoogleUser(String sub, String email, String name, String picture) {}

    private final String clientId;
    private final RestClient http = RestClient.create();

    public GoogleAuthService(@Value("${google.client-id:}") String clientId) {
        this.clientId = clientId;
    }

    @SuppressWarnings("unchecked")
    public GoogleUser verify(String accessToken) {
        if (clientId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Google login chưa được cấu hình");
        }
        try {
            Map<String, Object> info = http.get()
                    .uri("https://oauth2.googleapis.com/tokeninfo?access_token={t}", accessToken)
                    .retrieve().body(Map.class);
            if (info == null || !clientId.equals(info.get("aud"))) {
                throw invalid();
            }

            Map<String, Object> user = http.get()
                    .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve().body(Map.class);
            if (user == null || user.get("email") == null
                    || !Boolean.TRUE.equals(user.get("email_verified"))) {
                throw invalid();
            }
            return new GoogleUser((String) user.get("sub"), ((String) user.get("email")).toLowerCase(),
                    (String) user.get("name"), (String) user.get("picture"));
        } catch (RestClientException e) {
            throw invalid();
        }
    }

    private static ResponseStatusException invalid() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google token không hợp lệ");
    }
}
