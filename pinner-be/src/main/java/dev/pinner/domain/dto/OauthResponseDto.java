package dev.pinner.domain.dto;

import lombok.Data;

public class OauthResponseDto {

    @Data
    public static class NaverResponse {
        private String result;
        private String access_token;
    }
}
