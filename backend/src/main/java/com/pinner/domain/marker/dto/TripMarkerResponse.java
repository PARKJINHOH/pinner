package com.pinner.domain.marker.dto;

import com.pinner.domain.day.entity.TripDay;
import com.pinner.domain.marker.entity.Marker;

import java.time.LocalDate;

public record TripMarkerResponse(
        Long markerId,
        Long dayId,
        String dayName,
        LocalDate date,
        Double lat,
        Double lng,
        String label,
        boolean isAuto,
        String thumbnailUrl
) {
    public static TripMarkerResponse from(Marker marker, String thumbnailUrl) {
        TripDay day = marker.getTripDay();
        return new TripMarkerResponse(
                marker.getId(),
                day.getId(),
                day.getName(),
                day.getDate(),
                marker.getLat().doubleValue(),
                marker.getLng().doubleValue(),
                marker.getLabel(),
                marker.isAuto(),
                thumbnailUrl
        );
    }
}
