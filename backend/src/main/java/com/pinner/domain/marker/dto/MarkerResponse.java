package com.pinner.domain.marker.dto;

import com.pinner.domain.marker.entity.Marker;

public record MarkerResponse(
        Long markerId,
        Long dayId,
        Double lat,
        Double lng,
        String label,
        boolean isAuto
) {
    public static MarkerResponse from(Marker marker) {
        return new MarkerResponse(
                marker.getId(),
                marker.getTripDay().getId(),
                marker.getLat().doubleValue(),
                marker.getLng().doubleValue(),
                marker.getLabel(),
                marker.isAuto()
        );
    }
}
