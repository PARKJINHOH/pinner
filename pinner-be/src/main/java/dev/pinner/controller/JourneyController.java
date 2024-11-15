package dev.pinner.controller;

import dev.pinner.domain.dto.JourneyDto;
import dev.pinner.domain.dto.TravelDto;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.service.JourneyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/journey")
public class JourneyController {

    private final JourneyService journeyService;

    /**
     * 여정 추가
     */
    @PostMapping()
    public ResponseEntity<?> createJourney(@AuthenticationPrincipal Traveler traveler,
                                           @RequestPart("newJourney") JourneyDto.Request newJourney,
                                           @RequestPart(value = "photo", required = false) List<MultipartFile> photos) {
        List<TravelDto.Response> travels = journeyService.addJourney(traveler, newJourney, photos);
        return ResponseEntity.ok(travels);
    }

    /**
     * 여정 삭제
     */
    @DeleteMapping("/{journeyId}")
    public ResponseEntity<?> deleteJourney(@AuthenticationPrincipal Traveler traveler,
                                           @PathVariable Long journeyId) {
        List<TravelDto.Response> travels = journeyService.deleteJourney(traveler, journeyId);
        return ResponseEntity.ok(travels);
    }

    /**
     * 여정 수정
     */
    @PutMapping("/{journeyId}")
    public ResponseEntity<?> updateJourney(@AuthenticationPrincipal Traveler traveler,
                                           @PathVariable Long journeyId,
                                           @RequestPart("newJourney") JourneyDto.Request newJourney,
                                           @RequestPart(value = "photo", required = false) List<MultipartFile> photos) {
        List<TravelDto.Response> travels = journeyService.updateJourney(traveler, journeyId, newJourney, photos);
        return ResponseEntity.ok(travels);
    }
}
