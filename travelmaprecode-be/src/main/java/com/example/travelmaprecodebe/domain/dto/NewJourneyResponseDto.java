package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Journey;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class NewJourneyResponseDto {
    private long id;
    private int orderKey;
    private LocalDate date;
    private List<String> hashtags;

    public NewJourneyResponseDto(Journey journey) {
        id = journey.getId();
        orderKey = journey.getOrderKey();
        date = journey.getDate();
        hashtags = journey.getHashtags();
    }
}
