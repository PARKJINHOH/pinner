package com.pinner.domain.marker.dto;

import jakarta.validation.constraints.NotNull;

public record MarkerRequest(
        @NotNull(message = "위도는 필수입니다")
        Double lat,

        @NotNull(message = "경도는 필수입니다")
        Double lng,

        String label
) {}
