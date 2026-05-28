package com.pinner.domain.trip.controller;

import com.pinner.domain.trip.dto.*;
import com.pinner.domain.trip.service.TripService;
import com.pinner.domain.user.service.UserDetailsImpl;
import com.pinner.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @GetMapping
    public ApiResponse<List<TripResponse>> getMyTrips(
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ApiResponse.success(tripService.getMyTrips(user.getUserId()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<TripResponse> createTrip(
            @AuthenticationPrincipal UserDetailsImpl user,
            @Valid @RequestBody TripCreateRequest request) {
        return ApiResponse.success(tripService.createTrip(user.getUserId(), request));
    }

    @PutMapping("/{tripId}")
    public ApiResponse<TripResponse> updateTrip(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId,
            @Valid @RequestBody TripUpdateRequest request) {
        return ApiResponse.success(tripService.updateTrip(user.getUserId(), tripId, request));
    }

    @DeleteMapping("/{tripId}")
    public ApiResponse<Void> deleteTrip(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId) {
        tripService.deleteTrip(user.getUserId(), tripId);
        return ApiResponse.success();
    }

    @PatchMapping("/sort")
    public ApiResponse<Void> updateSort(
            @AuthenticationPrincipal UserDetailsImpl user,
            @Valid @RequestBody TripSortRequest request) {
        tripService.updateSort(user.getUserId(), request);
        return ApiResponse.success();
    }
}
