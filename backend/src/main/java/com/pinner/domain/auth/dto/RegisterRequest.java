package com.pinner.domain.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email(message = "올바른 이메일 형식이 아닙니다")
        String email,

        @NotBlank @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
        String password,

        @NotBlank @Size(min = 2, max = 20, message = "닉네임은 2~20자 사이여야 합니다")
        String nickname
) {}
