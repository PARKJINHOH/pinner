package dev.pinner.domain.dto.oauth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class NaverDto {

    @Data
    public static class NaverWithdrawalResponse {
        private String result;
        private String access_token;
    }

    @Data
    public static class NaverResponseWrapper {
        String resultcode;
        String message;
        NaverResponse response;
    }

    @Data
    public static class NaverResponse {
        String email;
        String nickname;
        String profileImage;
        String age;
        String gender;
        String id;
        String name;
        String birthday;
        String birthyear;
        String mobile;
    }

}
