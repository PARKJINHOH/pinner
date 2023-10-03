package com.example.travelmaprecodebe.global;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OauthServiceCode {
    GOOGLE("Google"),
    NAVER("Naver");

    private final String signupServices;
}
