package dev.pinner.domain.entity;

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

    private double lat;
    private double lng;

    @NotNull
    private String name;

    @NotNull
    private String countryCd;

    @OneToOne(mappedBy = "geoLocation")
    private Journey journey;

    @Builder
    public GeoLocation(double lat, double lng, String name, String countryCd) {
        this.lat = lat;
        this.lng = lng;
        this.name = name;
        this.countryCd = countryCd;
    }
}
