package com.pinner.domain.trip.repository;

import com.pinner.domain.trip.dto.TripResponse;

import java.util.List;

public interface TripRepositoryCustom {
    List<TripResponse> findMyTrips(Long userId);
}
