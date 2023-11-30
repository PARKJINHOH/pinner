package dev.pinner.controller;

import dev.pinner.domain.dto.TravelDto;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.service.TravelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 여행(Travel)을 관리하는 Controller
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/travel")
public class TravelController {

    private final TravelService travelService;

    /**
     * 여행 불러오기
     */
    @GetMapping()
    public ResponseEntity<?> getTravel(@AuthenticationPrincipal Traveler traveler) {
        List<TravelDto.Response> getTravels = travelService.getTravel(traveler);
        return ResponseEntity.ok(getTravels);
    }

    /**
     * 여행 추가
     */
    @PostMapping()
    public ResponseEntity<?> postTravel(@AuthenticationPrincipal Traveler traveler,
                                        @RequestBody @Valid TravelDto.Request newTravel) {
        List<TravelDto.Response> getTravels = travelService.addTravel(traveler, newTravel);
        return ResponseEntity.ok(getTravels);
    }

    /**
     * 여행 삭제
     */
    @DeleteMapping("/{travelId}")
    public ResponseEntity<?> deleteTravel(@AuthenticationPrincipal Traveler traveler,
                                          @PathVariable Long travelId) {
        List<TravelDto.Response> getTravels = travelService.deleteTravel(traveler, travelId);
        return ResponseEntity.ok(getTravels);
    }

    /**
     * 여행 순번 수정
     */
    @PutMapping("/orderKey")
    public ResponseEntity<?> putTravelOrderKey(@AuthenticationPrincipal Traveler traveler,
                                               @RequestBody @Valid List<TravelDto.Request> travelList) {
        List<TravelDto.Response> getTravels = travelService.updateTravelOrderKey(traveler, travelList);
        return ResponseEntity.ok(getTravels);
    }

    /**
     * 여행 타이틀 수정
     */
    @PatchMapping("/{travelId}")
    public ResponseEntity<?> putTravelTitle(@AuthenticationPrincipal Traveler traveler,
                                            @PathVariable Long travelId,
                                            @RequestBody @Valid TravelDto.Request newTravel) {

        List<TravelDto.Response> getTravels = travelService.updateTravelTitle(traveler, travelId, newTravel);
        return ResponseEntity.ok(getTravels);
    }
}
