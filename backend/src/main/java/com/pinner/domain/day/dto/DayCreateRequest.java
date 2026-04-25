package com.pinner.domain.day.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record DayCreateRequest(
        @NotBlank @Size(min = 1, max = 30, message = "이름은 1~30자 사이여야 합니다")
        String name,

        LocalDate date
) {}
