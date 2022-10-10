package com.example.travelmaprecodebe.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class NewJourneyRequestDto {
    private LocalDate date;
    private NewLocation newLocation;
//    private List<Set<String>> hashtags;
    private List<String> hashtags;

    @Setter
    public static class NewLocation{
        private double lat;
        private double lng;
        private String name;
    }

//    @Setter
//    public static class HashTags{
//        private String value;
//    }
}
