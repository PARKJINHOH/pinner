package dev.pinner.controller;

import dev.pinner.domain.dto.TravelDto;
import dev.pinner.domain.dto.TravelShareDto;
import dev.pinner.domain.entity.TravelShareInfo;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.service.TravelService;
import dev.pinner.service.TravelShareService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 여행(Travel)을 관리하는 Controller
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/travel")
public class TravelController {

    private final TravelService travelService;
    private final TravelShareService travelShareService;

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

    /**
     * 여행 공유한 사용자들 조회
     */
    @GetMapping("/{travelId}/share")
    public ResponseEntity<?> getMemberShared(@PathVariable String travelId) {

        TravelDto.Response sharedTravel = travelShareService.getPublicSharedTravel(travelId);
        return ResponseEntity.ok(sharedTravel);
    }


    /**
     * 여행 공유 생성
     */
    @PostMapping("/share")
    public ResponseEntity<?> createTravelShare(@AuthenticationPrincipal Traveler traveler,
                                               @RequestBody @Valid TravelShareDto.Request shareReq) {

        Optional<Duration> duration = shareReq
            .getDurationInSec()
            .map(Duration::ofSeconds);

        if (shareReq.getShareType().equals("PUBLIC")) {
            TravelShareInfo shareInfo = travelShareService.createTravelSharePublic(traveler, shareReq.getTravelId(), duration);
            return ResponseEntity.ok(Map.of("shareCode", shareInfo.getShareCode()));
        } else {
            TravelShareInfo shareInfo = travelShareService.createTravelShareForMember(traveler, shareReq.getTravelId(), shareReq.getGuestEmail().get(), duration);
            return ResponseEntity.ok(HttpStatus.OK);
        }
    }

    /**
     * 여행 공개 공유 조회
     */
    @GetMapping("/share/{travelShareId}")
    public ResponseEntity<?> getTravelShare(@PathVariable String travelShareId) {

        TravelDto.Response sharedTravel = travelShareService.getPublicSharedTravel(travelShareId);
        return ResponseEntity.ok(sharedTravel);
    }

    /**
     * 여행 공유 삭제
     */
    @DeleteMapping("/share/{travelShareId}")
    public ResponseEntity<?> deleteTravelShare(@AuthenticationPrincipal Traveler traveler,
                                               @PathVariable String travelShareId) {

        travelShareService.deleteTravelShare(traveler, travelShareId);
        return ResponseEntity.ok(HttpStatus.OK);
    }
}
