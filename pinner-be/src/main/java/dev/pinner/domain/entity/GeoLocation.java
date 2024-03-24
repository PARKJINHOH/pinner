package dev.pinner.domain.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Table(name = "GEO_LOCATION")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GeoLocation extends AuditEntity {

    @Id
    @Column(name = "GEOLOCATION_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Comment("위도")
    private double lat;

    @Comment("경도")
    private double lng;

    @Comment("위치 정보")
    @NotNull
    private String name;

    @Comment("국가")
    @NotNull
    private String countryCd;

    @Comment("여정")
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
