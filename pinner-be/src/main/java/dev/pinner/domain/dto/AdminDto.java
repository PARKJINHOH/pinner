package dev.pinner.domain.dto;

import dev.pinner.domain.entity.Admin;
import dev.pinner.global.enums.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


public class AdminDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request {
        private String email;
        private String adminName;
        private String password;
        private String newPassword;
        private String accessToken;
        private String refreshToken;

        public Admin toEntity() {
            return Admin.builder()
                    .email(email)
                    .adminName(adminName)
                    .password(password)
                    .roleEnum(RoleEnum.ADMIN)
                    .build();
        }
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response {
        private String email;
        private String adminName;
        private String password;
        private String accessToken;
        private String refreshToken;
    }

}
