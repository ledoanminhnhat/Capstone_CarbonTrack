package com.carbontrack.service;

import com.carbontrack.dto.CommunityDtos.UploadSignature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

/**
 * Ký "signed upload" cho Cloudinary. API secret chỉ nằm ở backend;
 * frontend nhận chữ ký rồi upload ảnh thẳng lên Cloudinary.
 * Các giới hạn (folder, định dạng, resize) nằm TRONG chữ ký nên client không đổi được.
 */
@Service
public class UploadService {

    /** Loại ảnh: mỗi loại có folder + cách resize riêng. */
    public enum Kind {
        POST("carbontrack/community", "c_limit,h_1200,w_1200"),     // ảnh bài đăng: tối đa 1200px
        AVATAR("carbontrack/avatars", "c_fill,g_face,h_256,w_256"); // avatar: vuông 256px, căn theo mặt

        final String folder;
        final String transformation;

        Kind(String folder, String transformation) {
            this.folder = folder;
            this.transformation = transformation;
        }
    }

    public static final String ALLOWED_FORMATS = "jpg,png,webp";
    public static final long MAX_BYTES = 5L * 1024 * 1024; // 5MB (kiểm ở frontend)

    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;

    public UploadService(@Value("${cloudinary.cloud-name:}") String cloudName,
                         @Value("${cloudinary.api-key:}") String apiKey,
                         @Value("${cloudinary.api-secret:}") String apiSecret) {
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    public UploadSignature sign(Kind kind) {
        if (cloudName.isBlank() || apiKey.isBlank() || apiSecret.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Image upload is not configured (missing cloudinary.* in .env.properties)");
        }
        long timestamp = System.currentTimeMillis() / 1000;
        // Tham số sắp theo thứ tự alphabet, nối "&", rồi nối secret ở cuối -> SHA-1
        String toSign = "allowed_formats=" + ALLOWED_FORMATS
                + "&folder=" + kind.folder
                + "&timestamp=" + timestamp
                + "&transformation=" + kind.transformation;
        return new UploadSignature(cloudName, apiKey, timestamp, sha1Hex(toSign + apiSecret),
                kind.folder, ALLOWED_FORMATS, kind.transformation, MAX_BYTES);
    }

    /** Chỉ nhận ảnh nằm trong cloud + đúng folder của loại đó. */
    public boolean isOwnImage(String url, Kind kind) {
        return url != null
                && !cloudName.isBlank()
                && url.startsWith("https://res.cloudinary.com/" + cloudName + "/image/upload/")
                && url.contains("/" + kind.folder + "/");
    }

    private static String sha1Hex(String s) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-1").digest(s.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
