package com.pinner.domain.auth.dto;

public record UserInfoResponse(
        Long userId,
        String email,
        String nickname,
        String provider
) {}
