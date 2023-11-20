package dev.pinner.controller;

import dev.pinner.domain.dto.GeoLocationDto;
import dev.pinner.exception.CustomException;
import dev.pinner.service.GeocodingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;
import java.io.IOException;

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
    ) throws IOException, InterruptedException {
        if (!reverse) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "this api only accept reverse geocoding");
        }

        GeoLocationDto.Response geoResponse = geocodingService.reverseGeocoding(lat, lng);
        if (geoResponse == null) {
            throw new CustomException(HttpStatus.NOT_FOUND, "Google Map APi Error");
        }

        return ResponseEntity.ok(geoResponse);
    }
}
