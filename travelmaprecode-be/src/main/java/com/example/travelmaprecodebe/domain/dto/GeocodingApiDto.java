package com.example.travelmaprecodebe.domain.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

/**
 * Response DTO of google reverse geocoding.
 */
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GeocodingApiDto {

    private String errorMessage;
    private PlusCode plusCode;
    private Result[] results;
    private String status;

    @Data
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class PlusCode {
        private String compoundCode;
        private String globalCode;
    }

    @Data
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class Result {
        private AddressComponent[] addressComponents;
        private String formattedAddress;
        private Geometry geometry;
        private String placeID;
        private String[] types;

        @Data
        @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
        public static class AddressComponent {
            private String longName;
            private String shortName;
            private String[] types;
        }

        @Data
        @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
        public static class Geometry {
            private Bounds bounds;
            private Location location;
            private String locationType;
            private Bounds viewport;

            @Data
            @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
            public static class Bounds {
                private Location northeast;
                private Location southwest;
            }

            @Data
            @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
            public static class Location {
                private double lat;
                private double lng;
            }
        }
    }
}
