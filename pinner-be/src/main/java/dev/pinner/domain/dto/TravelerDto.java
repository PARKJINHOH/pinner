package dev.pinner.domain.dto;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.global.enums.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


public class TravelerDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request {
        private String email;
        private String nickname;
        private String password;
        private String newPassword;
        private String accessToken;
        private String refreshToken;
        private String signupServices;

        public Traveler toEntity() {
            return Traveler.builder()
                    .email(email)
                    .nickname(nickname)
                    .password(password)
                    .roleEnum(RoleEnum.USER) // Default User
                    .signupServices(signupServices)
                    .build();
        }
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response {
        private String email;
        private String nickname;
        private String password;
        private String accessToken;
        private String refreshToken;
        private String signupServices;
    }

}
