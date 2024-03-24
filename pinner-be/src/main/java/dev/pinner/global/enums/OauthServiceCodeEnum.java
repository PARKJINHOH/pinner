package dev.pinner.global.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OauthServiceCodeEnum {
    GOOGLE("google"),
    NAVER("naver");

    private final String signupServices;
}
