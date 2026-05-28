package com.pinner.domain.day.service;

import com.pinner.domain.day.dto.*;
import com.pinner.domain.day.entity.TripDay;
import com.pinner.domain.day.repository.TripDayRepository;
import com.pinner.domain.marker.repository.MarkerRepository;
import com.pinner.domain.photo.repository.PhotoRepository;
import com.pinner.domain.trip.entity.Trip;
import com.pinner.domain.trip.repository.TripRepository;
import com.pinner.domain.user.entity.User;
import com.pinner.domain.user.repository.UserRepository;
import com.pinner.global.exception.BusinessException;
import com.pinner.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripDayService {

    private final TripRepository tripRepository;
    private final TripDayRepository tripDayRepository;
    private final PhotoRepository photoRepository;
    private final MarkerRepository markerRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<DayResponse> getDays(Long userId, Long tripId) {
        verifyTripOwner(userId, tripId);
        return tripDayRepository.findDays(userId, tripId);
    }

    @Transactional
    public DayResponse createDay(Long userId, Long tripId, DayCreateRequest request) {
        Trip trip = findTripWithOwnerCheck(userId, tripId);
        User user = userRepository.getReferenceById(userId);

        TripDay day = TripDay.of(trip, user, request.name(), request.date());
        tripDayRepository.save(day);

        return DayResponse.from(day, 0L, false);
    }

    @Transactional
    public DayResponse updateDay(Long userId, Long tripId, Long dayId, DayUpdateRequest request) {
        verifyTripOwner(userId, tripId);
        TripDay day = findDayWithOwnerCheck(userId, dayId);

        day.updateName(request.name());
        day.updateDate(request.date());

        return DayResponse.from(day, null, false);
    }

    @Transactional
    public void deleteDay(Long userId, Long tripId, Long dayId) {
        verifyTripOwner(userId, tripId);
        TripDay day = findDayWithOwnerCheck(userId, dayId);

        LocalDateTime now = LocalDateTime.now();
        photoRepository.softDeleteByDayId(dayId, now);
        markerRepository.softDeleteByDayId(dayId, now);
        day.softDelete();
    }

    private Trip findTripWithOwnerCheck(Long userId, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_NOT_FOUND));
        if (!trip.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return trip;
    }

    private TripDay findDayWithOwnerCheck(Long userId, Long dayId) {
        return tripDayRepository.findByIdAndUser_IdAndDeletedAtIsNull(dayId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_DAY_NOT_FOUND));
    }

    private void verifyTripOwner(Long userId, Long tripId) {
        tripRepository.findByIdAndUser_IdAndDeletedAtIsNull(tripId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_NOT_FOUND));
    }
}
