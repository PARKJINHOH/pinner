package com.example.travelmaprecodebe.controller;

import com.example.travelmaprecodebe.domain.dto.NewJourneyRequestDto;
import com.example.travelmaprecodebe.domain.dto.NewTravelRequestDto;
import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.service.TravelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/v1/travel")
@RequiredArgsConstructor
public class TravelController {

    private final TravelService travelService;


    @PostMapping()
    public ResponseEntity<?> postTravel(
            @AuthenticationPrincipal Traveler traveler,
            @RequestBody @Valid NewTravelRequestDto newTravel
    ) {
        return ResponseEntity.ok(travelService.postTravel(traveler.getId(), newTravel));
    }

    @GetMapping()
    public ResponseEntity<?> getTravel(@AuthenticationPrincipal Traveler traveler) {
        return ResponseEntity.ok(travelService.getTravel(traveler.getId()));
    }

    @PostMapping("/{travelEmail}/journey")
    public ResponseEntity<?> postJourney(
            @AuthenticationPrincipal Traveler traveler,
            @PathVariable String travelEmail,
            @RequestBody NewJourneyRequestDto newJourney
    ) {
        System.out.println("newJourney.getHashtags() = " + newJourney.getHashtags());
        return ResponseEntity.ok(travelService.postJourney(traveler.getId(), travelEmail, newJourney));
    }
}
