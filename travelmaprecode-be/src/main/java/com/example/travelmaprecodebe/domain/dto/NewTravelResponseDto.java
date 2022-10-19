package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Travel;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class NewTravelResponseDto {
    private long id;
    private int orderKey;
    private String title;
    private List<NewJourneyResponseDto> journeys;

    public NewTravelResponseDto(Travel travel) {
        id = travel.getId();
        orderKey = travel.getOrderKey();
        title = travel.getTitle();
        journeys = travel.getJourneys().stream()
                .map(NewJourneyResponseDto::new)
                .collect(Collectors.toList());
    }
}
