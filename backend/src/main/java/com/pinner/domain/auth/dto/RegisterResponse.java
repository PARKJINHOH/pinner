package com.pinner.domain.auth.dto;

public record RegisterResponse(
        Long userId,
        String email,
        String nickname
) {}
