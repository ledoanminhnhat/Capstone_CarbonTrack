package com.carbontrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync // gửi mail chạy nền (MailService)
public class CarbonTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarbonTrackApplication.class, args);
    }
}
