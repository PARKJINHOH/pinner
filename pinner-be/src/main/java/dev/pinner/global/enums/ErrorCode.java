package dev.pinner.global.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 400 BAD_REQUEST 잘못된 요청
    EMAIL_NOT_FOUND(HttpStatus.BAD_REQUEST.value()),
    EMAIL_DUPLICATION(HttpStatus.CONFLICT.value()),

    // 401 UNAUTHORIZED 인증되지 않은 요청

    // 403 FORBIDDEN 요청이 서버에 의해 이해되었지만 거부됨

    // 404 NOT_FOUND 잘못된 리소스 접근
    NOT_USER(HttpStatus.NOT_FOUND.value()),

    // 409 CONFLICT 중복된 리소스

    // 500 INTERNAL SERVER ERROR 서버 내부 오류
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR.value());


    private final int status;
}
