package dev.pinner.domain.dto;

import com.querydsl.core.annotations.QueryProjection;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.global.enums.RoleEnum;
import lombok.Builder;
import lombok.Data;


public class TravelerDto {

    @Data
    @Builder
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
    public static class Response {
        private String email;
        private String nickname;
        private String password;
        private String accessToken;
        private String refreshToken;
        private String signupServices;
    }

    @Data
    public static class SummaryResponse {

        private String name;
        private Long traveler;

        @QueryProjection
        public SummaryResponse(String name, Long traveler) {
            this.name = name;
            this.traveler = traveler;
        }

    }

}
