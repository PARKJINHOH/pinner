package dev.pinner.global.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OauthServiceCodeEnum {
    GOOGLE("Google"),
    NAVER("Naver");

    private final String signupServices;
}
