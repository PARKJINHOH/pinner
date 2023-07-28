package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Travel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class TravelDto {

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Request{
        Long id;
        String title;
        Integer orderKey;
    }

    @Getter
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
