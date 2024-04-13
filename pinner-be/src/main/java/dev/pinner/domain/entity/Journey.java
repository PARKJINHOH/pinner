package dev.pinner.domain.entity;


import dev.pinner.domain.dto.JourneyDto;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
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
    @Column(name = "JOURNEY_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(length = 50)
    @Comment("여정 순서")
    private int orderKey;

    @NotNull
    @Comment("여정 날짜")
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAVEL_ID")
    @Comment("여행")
    private Travel travel;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "GEOLOCATION_ID")
    @Comment("여정 위치")
    private GeoLocation geoLocation;

    @ElementCollection
    @JoinColumn(name = "HASHTAG")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Comment("여정 해시태그")
    private Set<String> hashtags;

    @OneToMany(mappedBy = "journey", cascade = CascadeType.ALL, orphanRemoval = true)
    @Comment("여정 사진")
    private List<Photo> photos = new ArrayList<>();

    public void setTravel(Travel travel) {
        // 연관 관계 편의 메소드
        if (this.travel != null) {
            this.travel.getJourneys().remove(this);
        }

        this.travel = travel;
        travel.getJourneys().add(this);
    }

    public void updateJourney(JourneyDto.Request newJourney, List<Photo> photoList) {
        this.date = newJourney.getDate();
        this.hashtags = newJourney.getHashtags();
        this.geoLocation = newJourney.getGeoLocation().toEntity();

        this.photos.clear();
        if (photoList != null) {
            this.photos.addAll(photoList);
        }
    }

    public void removePhoto(Photo photo) {
        photo.deleteImageFile();
    }

    @Builder
    public Journey(LocalDate date, Travel travel, GeoLocation geoLocation, Set<String> hashtags) {
        this.date = date;
        this.travel = travel;
        this.geoLocation = geoLocation;
        this.hashtags = hashtags;
    }
}
