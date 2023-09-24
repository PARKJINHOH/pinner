package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.global.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


public class TravelerDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request {
        private String email;
        private String name;
        private String password;
        private String newPassword;
        private String accessToken;
        private String refreshToken;
        private String signupServices;

        public Traveler toEntity() {
            return Traveler.builder()
                    .email(email)
                    .name(name)
                    .password(password)
                    .role(Role.USER) // Default User
                    .signupServices(signupServices)
                    .build();
        }
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response {
        private String email;
        private String name;
        private String password;
        private String accessToken;
        private String refreshToken;
    }

}
