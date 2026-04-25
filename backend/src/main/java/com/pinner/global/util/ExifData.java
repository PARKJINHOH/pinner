package com.pinner.global.util;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ExifData {

    private final Double lat;
    private final Double lng;
    private final LocalDateTime takenAt;

    private ExifData(Double lat, Double lng, LocalDateTime takenAt) {
        this.lat = lat;
        this.lng = lng;
        this.takenAt = takenAt;
    }

    public static ExifData of(Double lat, Double lng, LocalDateTime takenAt) {
        return new ExifData(lat, lng, takenAt);
    }

    public static ExifData empty() {
        return new ExifData(null, null, null);
    }

    public boolean hasGps() {
        return lat != null && lng != null;
    }
}
