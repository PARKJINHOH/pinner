package com.pinner.domain.trip.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record TripSortRequest(
        @NotEmpty
        List<Long> tripIds
) {}
