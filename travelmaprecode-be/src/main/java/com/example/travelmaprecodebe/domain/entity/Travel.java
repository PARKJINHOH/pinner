package com.example.travelmaprecodebe.domain.entity;

import com.example.travelmaprecodebe.domain.AuditEntity;
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
    private List<Journey> journey = new ArrayList<>();

    @Builder
    public Travel(int orderKey, String title, List<Journey> journey) {
        this.orderKey = orderKey;
        this.title = title;
        this.journey = journey;
    }
}
