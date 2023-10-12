package dev.pinner.global.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 역 지오코딩 API 응답 상태
 * <a href="https://developers.google.com/maps/documentation/geocoding/requests-geocoding?hl=ko">...</a>
 */
@Getter
@RequiredArgsConstructor
public enum GeocodingStatusEnum {
    OK("OK"),
    ZERO_RESULTS("ZERO_RESULTS"),
    OVER_QUERY_LIMIT("OVER_QUERY_LIMIT"),
    REQUEST_DENIED("REQUEST_DENIED"),
    INVALID_REQUEST("INVALID_REQUEST"),
    UNKNOWN_ERROR("UNKNOWN_ERROR");

    private final String name;
}
