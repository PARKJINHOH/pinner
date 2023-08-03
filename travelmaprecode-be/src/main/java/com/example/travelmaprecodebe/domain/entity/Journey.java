package com.example.travelmaprecodebe.domain.entity;


import com.example.travelmaprecodebe.domain.AuditEntity;
import com.example.travelmaprecodebe.domain.dto.JourneyDto;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Table(name = "JOURNEY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Journey extends AuditEntity {

    @Id
    @JoinColumn(name = "JOURNEY_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private int orderKey;

    @NotNull
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAVEL_ID")
    private Travel travel;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "GEOLOCATION_ID")
    private GeoLocation geoLocation;

    @ElementCollection
    @JoinColumn(name = "HASHTAG")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Set<String> hashtags;

    @OneToMany(mappedBy = "journey", cascade = CascadeType.ALL)
    private List<Photo> photos = new ArrayList<>();

    public void addTravel(Travel travel) {
        // 연관 관계 편의 메소드
        if (this.travel != null) {
            this.travel.getJourneys().remove(this);
        }

        this.travel = travel;
        travel.getJourneys().add(this);
    }

    public void updateJourney(JourneyDto.Request newJourney) {
        this.date = newJourney.getDate();
        this.hashtags = newJourney.getHashtags();
        this.geoLocation = newJourney.getGeoLocation().toEntity();
//        Todo
//        this.photos = newJourney.getPhotos();
    }

    @Builder
    public Journey(LocalDate date, Travel travel, GeoLocation geoLocation, Set<String> hashtags) {
        this.date = date;
        this.travel = travel;
        this.geoLocation = geoLocation;
        this.hashtags = hashtags;
    }
}
