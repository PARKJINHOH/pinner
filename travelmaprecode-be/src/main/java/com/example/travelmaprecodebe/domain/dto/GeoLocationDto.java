package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.GeoLocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


public class GeoLocationDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request {
        private double lat;
        private double lng;
        private String name;
        private String countryCd;

        public GeoLocation toEntity(){
            return GeoLocation.builder()
                    .lat(lat)
                    .lng(lng)
                    .countryCd(countryCd)
                    .name(name)
                    .build();
        }
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response {
        private double lat;
        private double lng;
        private String name;
        private String countryCd;

        public Response(GeoLocation geoLocation) {
            this.lat = geoLocation.getLat();
            this.lng = geoLocation.getLng();
            this.name = geoLocation.getName();
            this.countryCd = geoLocation.getCountryCd();
        }
    }
}
