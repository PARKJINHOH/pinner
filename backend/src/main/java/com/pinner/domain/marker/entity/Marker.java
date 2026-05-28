package com.pinner.domain.marker.entity;

import com.pinner.domain.day.entity.TripDay;
import com.pinner.domain.user.entity.User;
import com.pinner.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Entity
@Table(
        name = "markers",
        indexes = {
                @Index(name = "uk_markers_trip_day_id", columnList = "trip_day_id", unique = true),
                @Index(name = "idx_markers_user_id", columnList = "user_id")
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Marker extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_day_id", nullable = false, unique = true)
    private TripDay tripDay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "lat", nullable = false, precision = 10, scale = 7)
    private BigDecimal lat;

    @Column(name = "lng", nullable = false, precision = 10, scale = 7)
    private BigDecimal lng;

    @Column(name = "label", length = 255)
    private String label;

    @Column(name = "is_auto", nullable = false)
    private boolean auto;

    private Marker(TripDay tripDay, User user, BigDecimal lat, BigDecimal lng, String label, boolean auto) {
        this.tripDay = tripDay;
        this.user = user;
        this.lat = lat;
        this.lng = lng;
        this.label = label;
        this.auto = auto;
    }

    public static Marker ofAuto(TripDay tripDay, User user, BigDecimal lat, BigDecimal lng) {
        return new Marker(tripDay, user, lat, lng, null, true);
    }

    public static Marker ofManual(TripDay tripDay, User user, BigDecimal lat, BigDecimal lng, String label) {
        return new Marker(tripDay, user, lat, lng, label, false);
    }

    public void updateLocation(BigDecimal lat, BigDecimal lng) {
        this.lat = lat;
        this.lng = lng;
    }

    public void updateLabel(String label) {
        this.label = label;
    }

    public void setManual() {
        this.auto = false;
    }
}
