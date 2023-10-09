package dev.pinner.domain.entity;

import dev.pinner.domain.AuditEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
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
