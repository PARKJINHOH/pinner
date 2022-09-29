package com.example.travelmaprecodebe.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
public class NewJourneyRequestDto {
    private Date date;
    private Set<String> hashtags;
}
