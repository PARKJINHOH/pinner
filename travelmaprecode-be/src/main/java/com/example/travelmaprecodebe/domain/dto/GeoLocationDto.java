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
    private String country_iso_alp2;

    public GeoLocation toEntity(){
        return GeoLocation.builder()
                .lat(lat)
                .lng(lng)
                .name(name)
                .build();
    }

    public GeoLocationDto(GeoLocation geoLocation) {
        this.lat = geoLocation.getLat();
        this.lng = geoLocation.getLng();
        this.name = geoLocation.getName();
    }
}
