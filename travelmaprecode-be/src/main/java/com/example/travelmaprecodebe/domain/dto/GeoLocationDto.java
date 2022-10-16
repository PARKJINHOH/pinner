package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.GeoLocation;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GeoLocationDto {
    private double lat;
    private double lng;
    private String name;

    public GeoLocation toEntity(){
        return GeoLocation.builder()
                .lat(lat)
                .lng(lng)
                .name(name)
                .build();
    }

    public GeoLocationDto(double lat, double lng, String name) {
        this.lat = lat;
        this.lng = lng;
        this.name = name;
    }
}
