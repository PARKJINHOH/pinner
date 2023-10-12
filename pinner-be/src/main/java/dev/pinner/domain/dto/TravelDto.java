package dev.pinner.domain.dto;

import dev.pinner.domain.entity.Travel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class TravelDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request{
        Long id;
        String title;
        Integer orderKey;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response{
        private Long id;
        private int orderKey;
        private String title;
        private List<JourneyDto.Response> journeys;

        public Response(Travel travel) {
            id = travel.getId();
            orderKey = travel.getOrderKey();
            title = travel.getTitle();
            journeys = travel.getJourneys().stream()
                    .map(JourneyDto.Response::new)
                    .sorted(Comparator.comparing(JourneyDto.Response::getDate).thenComparing(JourneyDto.Response::getOrderKey))
                    .collect(Collectors.toList());
        }
    }
}
