package dev.pinner.global;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum JwtCode {
    ACCESS("ACCESS", "허용"),
    EXPIRED("EXPIRED", "만료"),
    DENIED("DENIED", "거부"),
    INVALID("INVALID", "무효");

    private final String key;
    private final String description;
}
