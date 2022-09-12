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
public class ResponseTravelDto {

    private int orderKey;
    private String title;
    private List<JourneyDto> journeys;

    public ResponseTravelDto(Travel travel) {
        this.orderKey = travel.getOrderKey();
        this.title = travel.getTitle();
        this.journeys = travel.getJourney().stream()
                .map(JourneyDto::new)
                .collect(Collectors.toList());
    }

    @Data
    @NoArgsConstructor
    public static class JourneyDto {
        private int orderKey;
        private Date date;
        private List<HashTagDto> hashtags;

        public JourneyDto(Journey journey) {
            this.orderKey = journey.getOrderKey();
            this.date = journey.getDate();
            this.hashtags = journey.getHashtag().stream()
                    .map(HashTagDto::new)
                    .collect(Collectors.toList());
        }

        public Journey toEntity() {
            return Journey.builder()
                    .orderKey(orderKey)
                    .date(date)
                    .hashtag(hashtags.stream()
                            .map(HashTagDto::toEntity)
                            .collect(Collectors.toList()))
                    .build();
        }

        @Data
        @NoArgsConstructor
        public static class HashTagDto {
            private String tag;

            public HashTagDto(HashTag hashTag) {
                this.tag = hashTag.getTag();
            }

            public HashTag toEntity() {
                return HashTag.builder()
                        .tag(tag)
                        .build();
            }
        }
    }

    public Travel toEntity() {
        return Travel.builder()
                .orderKey(orderKey)
                .title(title)
                .journey(journeys.stream()
                        .map(JourneyDto::toEntity)
                        .collect(Collectors.toList()))
                .build();
    }
}
