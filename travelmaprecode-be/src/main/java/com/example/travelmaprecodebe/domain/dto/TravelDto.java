package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.HashTag;
import com.example.travelmaprecodebe.domain.entity.Journey;
import com.example.travelmaprecodebe.domain.entity.Travel;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class TravelDto {

    private int orderKey;
    private String title;
    private List<JourneyDto> journeyDtoList;

    public TravelDto(Travel travel) {
        this.orderKey = travel.getOrderKey();
        this.title = travel.getTitle();
        this.journeyDtoList = travel.getJourney().stream()
                .map(journey -> new JourneyDto(journey))
                .collect(Collectors.toList());
    }

    @Data
    public static class JourneyDto {
        private int orderKey;
        private Date date;
        private List<HashTagDto> hashTagDtoList;

        public JourneyDto(Journey journey) {
            this.orderKey = journey.getOrderKey();
            this.date = journey.getDate();
            this.hashTagDtoList = journey.getHashtag().stream()
                    .map(hashTag -> new HashTagDto(hashTag))
                    .collect(Collectors.toList());
        }

        @Data
        public static class HashTagDto {
            private String tag;

            public HashTagDto(HashTag hashTag) {
                this.tag = hashTag.getTag();
            }
        }
    }
}
