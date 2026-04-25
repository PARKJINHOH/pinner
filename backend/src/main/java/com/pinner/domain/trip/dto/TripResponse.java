package com.pinner.domain.trip.dto;

import com.pinner.domain.trip.entity.Trip;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TripResponse(
        Long tripId,
        String title,
        LocalDate startDate,
        LocalDate endDate,
        int sortOrder,
        boolean isShared,
        Long dayCount,
        LocalDateTime createdAt
) {
    public static TripResponse from(Trip trip, Long dayCount) {
        return new TripResponse(
                trip.getId(),
                trip.getTitle(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getSortOrder(),
                trip.isShared(),
                dayCount,
                trip.getCreatedAt()
        );
    }
}
