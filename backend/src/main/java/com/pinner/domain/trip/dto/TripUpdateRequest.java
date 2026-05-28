package com.pinner.domain.trip.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TripUpdateRequest(
        @NotBlank @Size(min = 1, max = 50, message = "여행 제목은 1~50자 사이여야 합니다")
        String title,

        LocalDate startDate,

        LocalDate endDate
) {}
