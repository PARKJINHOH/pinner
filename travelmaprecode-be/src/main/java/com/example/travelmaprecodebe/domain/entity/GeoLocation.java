package com.example.travelmaprecodebe.domain.entity;

import com.example.travelmaprecodebe.domain.AuditEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Table(name = "GEOLOCATION")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GeoLocation extends AuditEntity {

    @Id
    @Column(name = "GEOLOCATION_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private double lat;

    @NotNull
    private double lng;

    @NotNull
    private String name;

    @OneToOne(mappedBy = "geoLocation")
    private Journey journey;

    @Builder
    public GeoLocation(double lat, double lng, String name) {
        this.lat = lat;
        this.lng = lng;
        this.name = name;
    }
}