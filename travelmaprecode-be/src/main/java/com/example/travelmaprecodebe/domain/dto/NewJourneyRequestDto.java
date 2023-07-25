package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Journey;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
public class NewJourneyRequestDto {
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
