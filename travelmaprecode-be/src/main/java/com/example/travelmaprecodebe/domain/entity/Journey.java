package com.example.travelmaprecodebe.domain.entity;


import com.example.travelmaprecodebe.domain.AuditEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

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

//    @OneToOne
//    private GoogleMapApi googleMapApi;

    @ElementCollection
    private List<String> hashtags;

    @Builder
    public Journey(int orderKey, LocalDate date, Travel travel, List<String> hashtags) {
        this.orderKey = orderKey;
        this.date = date;
        this.travel = travel;
        this.hashtags = hashtags;
    }

    public Journey(Travel travel, LocalDate date, List<String> hashtags, int orderKey) {
        this.travel = travel;
        this.date = date;
        this.hashtags = hashtags;
        this.orderKey = orderKey;
    }
}
