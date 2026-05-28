package com.pinner.domain.day.controller;

import com.pinner.domain.day.dto.*;
import com.pinner.domain.day.service.TripDayService;
import com.pinner.domain.user.service.UserDetailsImpl;
import com.pinner.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/days")
@RequiredArgsConstructor
public class TripDayController {

    private final TripDayService tripDayService;

    @GetMapping
    public ApiResponse<List<DayResponse>> getDays(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId) {
        return ApiResponse.success(tripDayService.getDays(user.getUserId(), tripId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<DayResponse> createDay(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId,
            @Valid @RequestBody DayCreateRequest request) {
        return ApiResponse.success(tripDayService.createDay(user.getUserId(), tripId, request));
    }

    @PutMapping("/{dayId}")
    public ApiResponse<DayResponse> updateDay(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId,
            @PathVariable Long dayId,
            @Valid @RequestBody DayUpdateRequest request) {
        return ApiResponse.success(tripDayService.updateDay(user.getUserId(), tripId, dayId, request));
    }

    @DeleteMapping("/{dayId}")
    public ApiResponse<Void> deleteDay(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId,
            @PathVariable Long dayId) {
        tripDayService.deleteDay(user.getUserId(), tripId, dayId);
        return ApiResponse.success();
    }
}
