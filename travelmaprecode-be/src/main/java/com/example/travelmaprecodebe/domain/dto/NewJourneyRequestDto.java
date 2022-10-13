package com.example.travelmaprecodebe.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
public class NewJourneyRequestDto {
    private LocalDate date;
    private GeoLocationDto geoLocation;
    private Set<String> hashTags;
}
