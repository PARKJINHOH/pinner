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

    @GetMapping()
    public ResponseEntity<?> getTravel(@AuthenticationPrincipal Traveler traveler) {
        try {
            ResponseEntity<List<TravelDto.Response>> newTravelResponseDtos = ResponseEntity.ok(travelService.getTravel(traveler));
            return ResponseEntity.ok(newTravelResponseDtos);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body("여행 조회를 실패했습니다.");
        }
    }

    @PostMapping()
    public ResponseEntity<?> postTravel(@AuthenticationPrincipal Traveler traveler,
                                        @RequestBody @Valid TravelDto.Request newTravel) {
        try {
            ResponseEntity<List<TravelDto.Response>> newTravelResponseDtos = ResponseEntity.ok(travelService.addTravel(traveler, newTravel));
            return ResponseEntity.ok(newTravelResponseDtos);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body("여행 가입을 실패했습니다.");
        }
    }

    @DeleteMapping("/{travelId}")
    public ResponseEntity<?> deleteTravel(@AuthenticationPrincipal Traveler traveler,
                                          @PathVariable Long travelId) {
        try {
            List<TravelDto.Response> newTravelResponseDtos = travelService.deleteTravel(traveler, travelId);
            return ResponseEntity.ok(newTravelResponseDtos);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body("여행 삭제를 실패했습니다.");
        }
    }

    @PutMapping("/orderKey")
    public ResponseEntity<?> putTravelOrderKey(@AuthenticationPrincipal Traveler traveler,
                                               @RequestBody @Valid List<TravelDto.Request> travelList) {
        try {
            List<TravelDto.Response> newTravelResponseDtos = travelService.updateTravelOrderKey(traveler, travelList);
            return ResponseEntity.ok(newTravelResponseDtos);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body("여행 순서 변경을 실패했습니다.");
        }
    }

    @PatchMapping("/{travelId}")
    public ResponseEntity<?> putTravelTitle(@AuthenticationPrincipal Traveler traveler,
                                            @PathVariable Long travelId,
                                            @RequestBody @Valid TravelDto.Request newTravel) {
        try {
            List<TravelDto.Response> newTravelResponseDtos = travelService.updateTravelTitle(traveler, travelId, newTravel);
            return ResponseEntity.ok(newTravelResponseDtos);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body("여행 제목 변경을 실패했습니다.");
        }
    }
}
