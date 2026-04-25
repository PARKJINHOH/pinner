package com.pinner.domain.marker.controller;

import com.pinner.domain.marker.dto.MarkerRequest;
import com.pinner.domain.marker.dto.MarkerResponse;
import com.pinner.domain.marker.dto.TripMarkerResponse;
import com.pinner.domain.marker.service.MarkerService;
import com.pinner.domain.user.service.UserDetailsImpl;
import com.pinner.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MarkerController {

    private final MarkerService markerService;

    @GetMapping("/api/trips/{tripId}/markers")
    public ApiResponse<List<TripMarkerResponse>> getMarkers(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId) {
        return ApiResponse.success(markerService.getMarkers(user.getUserId(), tripId));
    }

    @PostMapping("/api/trips/{tripId}/days/{dayId}/marker")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MarkerResponse> upsertMarker(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId,
            @PathVariable Long dayId,
            @Valid @RequestBody MarkerRequest request) {
        return ApiResponse.success(markerService.upsertMarker(user.getUserId(), tripId, dayId, request));
    }

    @PutMapping("/api/trips/{tripId}/days/{dayId}/marker")
    public ApiResponse<MarkerResponse> updateMarker(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId,
            @PathVariable Long dayId,
            @Valid @RequestBody MarkerRequest request) {
        return ApiResponse.success(markerService.updateMarker(user.getUserId(), tripId, dayId, request));
    }

    @DeleteMapping("/api/trips/{tripId}/days/{dayId}/marker")
    public ApiResponse<Void> deleteMarker(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId,
            @PathVariable Long dayId) {
        markerService.deleteMarker(user.getUserId(), tripId, dayId);
        return ApiResponse.success();
    }
}
