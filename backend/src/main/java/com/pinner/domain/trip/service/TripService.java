package com.pinner.domain.trip.service;

import com.pinner.domain.marker.repository.MarkerRepository;
import com.pinner.domain.photo.repository.PhotoRepository;
import com.pinner.domain.trip.dto.*;
import com.pinner.domain.trip.entity.Trip;
import com.pinner.domain.trip.repository.TripRepository;
import com.pinner.domain.day.repository.TripDayRepository;
import com.pinner.domain.user.entity.User;
import com.pinner.domain.user.repository.UserRepository;
import com.pinner.global.exception.BusinessException;
import com.pinner.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final TripDayRepository tripDayRepository;
    private final PhotoRepository photoRepository;
    private final MarkerRepository markerRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TripResponse> getMyTrips(Long userId) {
        return tripRepository.findMyTrips(userId);
    }

    @Transactional
    public TripResponse createTrip(Long userId, TripCreateRequest request) {
        validateDateRange(request.startDate(), request.endDate());

        User user = userRepository.getReferenceById(userId);
        int nextSortOrder = tripRepository.findMaxSortOrderByUserId(userId) + 1;

        Trip trip = Trip.of(user, request.title());
        trip.updatePeriod(request.startDate(), request.endDate());
        trip.updateSortOrder(nextSortOrder);
        tripRepository.save(trip);

        return TripResponse.from(trip, 0L);
    }

    @Transactional
    public TripResponse updateTrip(Long userId, Long tripId, TripUpdateRequest request) {
        validateDateRange(request.startDate(), request.endDate());

        Trip trip = findWithOwnerCheck(userId, tripId);
        trip.updateTitle(request.title());
        trip.updatePeriod(request.startDate(), request.endDate());

        long dayCount = tripDayRepository.findIdsByTripId(tripId).size();
        return TripResponse.from(trip, (long) dayCount);
    }

    @Transactional
    public void deleteTrip(Long userId, Long tripId) {
        Trip trip = findWithOwnerCheck(userId, tripId);

        LocalDateTime now = LocalDateTime.now();
        List<Long> dayIds = tripDayRepository.findIdsByTripId(tripId);

        if (!dayIds.isEmpty()) {
            photoRepository.softDeleteByDayIds(dayIds, now);
            markerRepository.softDeleteByDayIds(dayIds, now);
        }
        tripRepository.softDeleteDaysByTripId(tripId, now);
        trip.softDelete();
    }

    @Transactional
    public void updateSort(Long userId, TripSortRequest request) {
        List<Long> tripIds = request.tripIds();

        List<Trip> trips = tripRepository.findAllByIdsAndUserId(tripIds, userId);
        if (trips.size() != tripIds.size()) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        Map<Long, Trip> tripMap = trips.stream()
                .collect(Collectors.toMap(Trip::getId, t -> t));

        for (int i = 0; i < tripIds.size(); i++) {
            Trip trip = tripMap.get(tripIds.get(i));
            if (trip == null) throw new BusinessException(ErrorCode.TRIP_NOT_FOUND);
            trip.updateSortOrder(i + 1);
        }
    }

    private Trip findWithOwnerCheck(Long userId, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_NOT_FOUND));

        if (!trip.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return trip;
    }

    private void validateDateRange(java.time.LocalDate start, java.time.LocalDate end) {
        if (start != null && end != null && end.isBefore(start)) {
            throw new BusinessException(ErrorCode.INVALID_DATE_RANGE);
        }
    }
}
