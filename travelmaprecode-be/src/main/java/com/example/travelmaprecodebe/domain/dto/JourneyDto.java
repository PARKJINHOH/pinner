package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Journey;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class JourneyDto {

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Request {
        private LocalDate date;
        private GeoLocationDto geoLocation;
        private Set<String> hashtags;
        private List<Long> photos;

        public Journey toEntity() {
            return Journey.builder()
                    .date(date)
                    .geoLocation(geoLocation.toEntity())
                    .hashtags(hashtags)
                    .build();
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private int orderKey;
        private LocalDate date;
        private Set<String> hashtags;
        private List<PhotoDto.Response> photos;
        private GeoLocationDto geoLocationDto;

        public Response(Journey journey) {
            id = journey.getId();
            orderKey = journey.getOrderKey();
            date = journey.getDate();
            hashtags = journey.getHashtags();
            photos = journey.getPhotos().stream()
                    .map(PhotoDto.Response::new)
                    .collect(Collectors.toList());
            geoLocationDto = new GeoLocationDto(journey.getGeoLocation());
        }
    }
}
