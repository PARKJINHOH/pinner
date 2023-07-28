package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Journey;
import com.example.travelmaprecodebe.domain.entity.Photo;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class NewJourneyResponseDto {
    private Long id;
    private int orderKey;
    private LocalDate date;
    private Set<String> hashtags;
    private List<PhotoDto> photos;
    private GeoLocationDto geoLocationDto;

    public NewJourneyResponseDto(Journey journey) {
        id = journey.getId();
        orderKey = journey.getOrderKey();
        date = journey.getDate();
        hashtags = journey.getHashtags();
        photos = journey.getPhotos().stream()
                .map(PhotoDto::new)
                .collect(Collectors.toList());
        geoLocationDto = new GeoLocationDto(journey.getGeoLocation().getLat(), journey.getGeoLocation().getLng(), journey.getGeoLocation().getName());
    }
}