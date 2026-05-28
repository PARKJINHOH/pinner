package com.pinner.domain.day.repository;

import com.pinner.domain.day.dto.DayResponse;

import java.util.List;

public interface TripDayRepositoryCustom {
    List<DayResponse> findDays(Long userId, Long tripId);
}
