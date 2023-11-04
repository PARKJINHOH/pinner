package dev.pinner.domain.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

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
    @Comment("여행 순서")
    private int orderKey;

    @NotNull
    @Comment("여행 제목")
    private String title;

    @Comment("여정 목록")
    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL)
    private List<Journey> journeys = new ArrayList<>();

    @Comment("여행자")
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
