package dev.pinner.global.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EmailSmtpEnum {
    EMAIL_CERTIFIED("EC", "회원가입 이메일 인증"),
    TEMPORARY_PASSWORD("TP","임시비밀번호 발급");

    private final String type;
    private final String description;
}
