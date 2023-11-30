package dev.pinner.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;


public class EmailSMTPDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request {
        @Email(message = "유효하지 않은 이메일 형식입니다.", regexp = "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")
        @NotNull(message = "이메일은 필수입니다.")
        private String email;
        private String nickname;
        private String emailCode;
        private String emailType;
        private String subject;
        private String message;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response {
        private String code;
    }
}
