package com.example.travelmaprecodebe.controller;

import com.example.travelmaprecodebe.domain.dto.TravelDto;
import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.service.TravelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/travel")
public class TravelController {

    private final TravelService travelService;

    @GetMapping()
    public ResponseEntity<?> getTravel(@AuthenticationPrincipal Traveler traveler) {
        return ResponseEntity.ok(travelService.getTravel(traveler));
    }

    @PostMapping()
    public ResponseEntity<?> postTravel(@AuthenticationPrincipal Traveler traveler,
                                        @RequestBody @Valid TravelDto.Request newTravel) {
        return ResponseEntity.ok(travelService.addTravel(traveler, newTravel));
    }

    @DeleteMapping("/{travelId}")
    public ResponseEntity<?> deleteTravel(@AuthenticationPrincipal Traveler traveler,
                                          @PathVariable Long travelId) {
        try {
            List<TravelDto.Response> newTravelResponseDtos = travelService.deleteTravel(traveler, travelId);
            return ResponseEntity.ok(newTravelResponseDtos);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body("관리자에게 문의해주세요");
        }
    }

    @PutMapping("/orderKey")
    public ResponseEntity<?> putTravelOrderKey(@AuthenticationPrincipal Traveler traveler,
                                      @RequestBody @Valid List<TravelDto.Request> travelList) {
        List<TravelDto.Response> newTravelResponseDtos = travelService.updateTravelOrderKey(traveler, travelList);
        return new ResponseEntity<>(newTravelResponseDtos, HttpStatus.OK);
    }

    @PatchMapping("/{travelId}")
    public ResponseEntity<?> putTravelTitle(@AuthenticationPrincipal Traveler traveler,
                                            @PathVariable Long travelId,
                                            @RequestBody @Valid TravelDto.Request newTravel) {
        List<TravelDto.Response> newTravelResponseDtos = travelService.updateTravelTitle(traveler, travelId, newTravel);
        return new ResponseEntity<>(newTravelResponseDtos, HttpStatus.OK);
    }
}
