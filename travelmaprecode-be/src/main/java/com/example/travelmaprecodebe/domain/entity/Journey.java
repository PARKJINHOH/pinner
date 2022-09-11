package com.example.travelmaprecodebe.domain.entity;


import com.example.travelmaprecodebe.domain.AuditEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
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
    @Temporal(TemporalType.DATE)
    private Date date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAVEL_ID")
    private Travel travel;

//    @OneToOne
//    private GoogleMapApi googleMapApi;

    @OneToMany(mappedBy = "hashtag")
    private List<HashTag> hashtag = new ArrayList<>();

    @Builder
    public Journey(int orderKey, Date date, Travel travel) {
        this.orderKey = orderKey;
        this.date = date;
        this.travel = travel;
    }
}
