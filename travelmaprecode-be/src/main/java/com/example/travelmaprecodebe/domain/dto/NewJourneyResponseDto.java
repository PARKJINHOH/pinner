package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Journey;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
public class NewJourneyResponseDto {
    private Long id;
    private int orderKey;
    private LocalDate date;
    private Set<String> hashtags;
    private GeoLocationDto geoLocationDto;

    public NewJourneyResponseDto(Journey journey) {
        id = journey.getId();
        orderKey = journey.getOrderKey();
        date = journey.getDate();
        hashtags = journey.getHashtags();
        geoLocationDto = new GeoLocationDto(journey.getGeoLocation().getLat(), journey.getGeoLocation().getLng(), journey.getGeoLocation().getName());
    }
}
