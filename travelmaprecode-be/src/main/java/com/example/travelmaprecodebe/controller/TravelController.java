package com.example.travelmaprecodebe.controller;

import com.example.travelmaprecodebe.domain.dto.NewJourneyRequestDto;
import com.example.travelmaprecodebe.domain.dto.NewTravelRequestDto;
import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.service.TravelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/v1/travel")
@RequiredArgsConstructor
public class TravelController {
    // todo : Token 확인

    private final TravelService travelService;

    @GetMapping()
    public ResponseEntity<?> getTravel(@AuthenticationPrincipal Traveler traveler) {
        return ResponseEntity.ok(travelService.getTravel(traveler.getId()));
    }

    @PostMapping()
    public ResponseEntity<?> postTravel(
            @AuthenticationPrincipal Traveler traveler,
            @RequestBody @Valid NewTravelRequestDto newTravel
    ) {
        return ResponseEntity.ok(travelService.postTravel(traveler.getId(), newTravel));
    }

    @PostMapping("/{travelId}/journey")
    public ResponseEntity<?> postJourney(
            @AuthenticationPrincipal Traveler traveler,
            @PathVariable Long travelId,
            @RequestBody NewJourneyRequestDto newJourney
    ) {
        return ResponseEntity.ok(travelService.postJourney(traveler.getId(), travelId, newJourney));
    }

    @DeleteMapping("/{travelId}")
    public ResponseEntity<?> deleteTravel(@AuthenticationPrincipal Traveler traveler, @PathVariable Long travelId) {
        Long delResult = travelService.deleteTravel(traveler.getId(), travelId);
        if (delResult != 0) {
            return ResponseEntity.ok(HttpStatus.OK);
        } else {
            return ResponseEntity.ok(HttpStatus.BAD_REQUEST);
        }

    }
}
