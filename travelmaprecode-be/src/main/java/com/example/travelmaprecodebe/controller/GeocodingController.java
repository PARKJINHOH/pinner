package com.example.travelmaprecodebe.controller;

import com.example.travelmaprecodebe.domain.dto.GeoLocationDto;
import com.example.travelmaprecodebe.service.GeocodingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/geocoding")
public class GeocodingController {

    private final GeocodingService geocodingService;

    /**
     * 주어진 위도와 경도를 기반으로 국가와 시로 구성된 문자열 반환
     *
     * @param lat     latitude
     * @param lng     longitude
     * @param reverse must be {@code true}
     * @return formatted string in Korean. for example, {@code 포르투갈 포르토}
     */
    @GetMapping
    public ResponseEntity<?> geocoding(
            @RequestParam("lat") @NotNull double lat,
            @RequestParam("lng") @NotNull double lng,
            @RequestParam("reverse") boolean reverse
    ) {
        try {
            if (!reverse) {
                return ResponseEntity.badRequest().body("this api only accept reverse geocoding");
            }

            GeoLocationDto.Response geoResponse = geocodingService.reverseGeocoding(lat, lng);
            if (geoResponse == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(geoResponse);
        } catch (Exception e) {
            log.error("something wrong: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
