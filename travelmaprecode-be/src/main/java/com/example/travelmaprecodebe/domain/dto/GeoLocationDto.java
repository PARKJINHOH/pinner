package com.example.travelmaprecodebe.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GeoLocationDto {
    private double lat;
    private double lng;
    private String name;
}
