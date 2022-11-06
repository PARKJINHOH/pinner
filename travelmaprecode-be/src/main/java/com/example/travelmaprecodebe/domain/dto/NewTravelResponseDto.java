package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Travel;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class NewTravelResponseDto {
    private Long id;
    private int orderKey;
    private String title;
    private List<NewJourneyResponseDto> journeys;

    public NewTravelResponseDto(Travel travel) {
        id = travel.getId();
        orderKey = travel.getOrderKey();
        title = travel.getTitle();
        journeys = travel.getJourneys().stream()
                .map(NewJourneyResponseDto::new)
                .sorted(Comparator.comparing(NewJourneyResponseDto::getDate).thenComparing(NewJourneyResponseDto::getOrderKey))
                .collect(Collectors.toList());
    }
}
