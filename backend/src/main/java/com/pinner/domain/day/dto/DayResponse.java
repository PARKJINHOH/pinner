package com.pinner.domain.day.dto;

import com.pinner.domain.day.entity.TripDay;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record DayResponse(
        Long dayId,
        Long tripId,
        String name,
        LocalDate date,
        Long photoCount,
        boolean hasMarker,
        LocalDateTime createdAt
) {
    public static DayResponse from(TripDay day, Long photoCount, boolean hasMarker) {
        return new DayResponse(
                day.getId(),
                day.getTrip().getId(),
                day.getName(),
                day.getDate(),
                photoCount,
                hasMarker,
                day.getCreatedAt()
        );
    }
}
