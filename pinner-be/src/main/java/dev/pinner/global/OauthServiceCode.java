package dev.pinner.global;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OauthServiceCode {
    GOOGLE("Google"),
    NAVER("Naver");

    private final String signupServices;
}
