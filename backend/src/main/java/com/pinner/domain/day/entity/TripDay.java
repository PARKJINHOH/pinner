package com.pinner.domain.day.entity;

import com.pinner.domain.marker.entity.Marker;
import com.pinner.domain.photo.entity.Photo;
import com.pinner.domain.trip.entity.Trip;
import com.pinner.domain.user.entity.User;
import com.pinner.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(
        name = "trip_days",
        indexes = {
                @Index(name = "idx_trip_days_trip_id", columnList = "trip_id"),
                @Index(name = "idx_trip_days_user_id", columnList = "user_id")
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TripDay extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "date")
    private LocalDate date;

    @OneToMany(mappedBy = "tripDay", cascade = CascadeType.ALL)
    private List<Photo> photos = new ArrayList<>();

    @OneToOne(mappedBy = "tripDay", cascade = CascadeType.ALL)
    private Marker marker;

    private TripDay(Trip trip, User user, String name, LocalDate date) {
        this.trip = trip;
        this.user = user;
        this.name = name;
        this.date = date;
    }

    public static TripDay of(Trip trip, User user, String name, LocalDate date) {
        return new TripDay(trip, user, name, date);
    }

    public void updateName(String name) {
        this.name = name;
    }

    public void updateDate(LocalDate date) {
        this.date = date;
    }
}
