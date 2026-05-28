package com.pinner.domain.marker.service;

import com.pinner.domain.day.entity.TripDay;
import com.pinner.domain.day.repository.TripDayRepository;
import com.pinner.domain.marker.dto.MarkerRequest;
import com.pinner.domain.marker.dto.MarkerResponse;
import com.pinner.domain.marker.dto.TripMarkerResponse;
import com.pinner.domain.marker.entity.Marker;
import com.pinner.domain.marker.repository.MarkerRepository;
import com.pinner.domain.photo.repository.PhotoRepository;
import com.pinner.domain.trip.repository.TripRepository;
import com.pinner.domain.user.entity.User;
import com.pinner.domain.user.repository.UserRepository;
import com.pinner.global.exception.BusinessException;
import com.pinner.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MarkerService {

    private final MarkerRepository markerRepository;
    private final TripRepository tripRepository;
    private final TripDayRepository tripDayRepository;
    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TripMarkerResponse> getMarkers(Long userId, Long tripId) {
        tripRepository.findByIdAndUser_IdAndDeletedAtIsNull(tripId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_NOT_FOUND));

        List<Marker> markers = markerRepository.findByTripIdWithDayAndDeletedAtIsNull(tripId);
        if (markers.isEmpty()) return Collections.emptyList();

        List<Long> dayIds = markers.stream().map(m -> m.getTripDay().getId()).toList();
        Map<Long, String> thumbnails = photoRepository.findFirstPhotoUrlsByDayIds(dayIds);

        return markers.stream()
                .map(m -> TripMarkerResponse.from(m, thumbnails.get(m.getTripDay().getId())))
                .toList();
    }

    @Transactional
    public MarkerResponse upsertMarker(Long userId, Long tripId, Long dayId, MarkerRequest request) {
        TripDay day = verifyAndGetDay(userId, tripId, dayId);
        User user = userRepository.getReferenceById(userId);

        BigDecimal lat = BigDecimal.valueOf(request.lat());
        BigDecimal lng = BigDecimal.valueOf(request.lng());

        Marker marker = markerRepository.findByTripDay_IdAndDeletedAtIsNull(dayId)
                .map(existing -> {
                    existing.updateLocation(lat, lng);
                    existing.updateLabel(request.label());
                    existing.setManual();
                    return existing;
                })
                .orElseGet(() -> markerRepository.save(
                        Marker.ofManual(day, user, lat, lng, request.label())
                ));

        return MarkerResponse.from(marker);
    }

    @Transactional
    public MarkerResponse updateMarker(Long userId, Long tripId, Long dayId, MarkerRequest request) {
        verifyAndGetDay(userId, tripId, dayId);

        Marker marker = markerRepository.findByTripDay_IdAndDeletedAtIsNull(dayId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MARKER_NOT_FOUND));

        marker.updateLocation(BigDecimal.valueOf(request.lat()), BigDecimal.valueOf(request.lng()));
        marker.updateLabel(request.label());

        return MarkerResponse.from(marker);
    }

    @Transactional
    public void deleteMarker(Long userId, Long tripId, Long dayId) {
        verifyAndGetDay(userId, tripId, dayId);

        Marker marker = markerRepository.findByTripDay_IdAndDeletedAtIsNull(dayId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MARKER_NOT_FOUND));

        marker.softDelete();
    }

    private TripDay verifyAndGetDay(Long userId, Long tripId, Long dayId) {
        tripRepository.findByIdAndUser_IdAndDeletedAtIsNull(tripId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_NOT_FOUND));

        TripDay day = tripDayRepository.findByIdAndUser_IdAndDeletedAtIsNull(dayId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_DAY_NOT_FOUND));

        if (!day.getTrip().getId().equals(tripId)) {
            throw new BusinessException(ErrorCode.TRIP_DAY_NOT_FOUND);
        }

        return day;
    }
}
