package dev.pinner.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


public class EmailSMTPDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request {
        private String email;
        private String emailCode;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response {
        private String code;
    }
}
