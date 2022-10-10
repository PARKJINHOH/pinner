package com.example.travelmaprecodebe.domain.entity;

import com.example.travelmaprecodebe.domain.AuditEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "TRAVEL")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Travel extends AuditEntity {

    @Id
    @Column(name = "TRAVEL_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private int orderKey;

    @NotNull
    private String title;

    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL)
    private List<Journey> journeys = new ArrayList<>();


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAVELER_ID")
    private Traveler traveler;

    public Journey addJourney(LocalDate date, List<String> hashtags) {
        int newOrder = journeys.size() + 1;

        Journey journey = new Journey(this, date, hashtags, newOrder);
        journeys.add(journey);
        return journey;
    }

    @Builder
    public Travel(int orderKey, String title, List<Journey> journeys) {
        this.orderKey = orderKey;
        this.title = title;
        this.journeys = journeys;
    }

    public Travel(Traveler traveler, String title, int orderKey) {
        this.traveler = traveler;
        this.title = title;
        this.orderKey = orderKey;
    }
}
