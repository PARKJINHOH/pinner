package dev.pinner.domain.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    @Comment("공유 목록")
    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL)
    private List<TravelShareInfo> travelShareInfos = new ArrayList<>();

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

    /**
     * 공개 공유
     *
     * @param duration 공유 시간, null이면 만료하지 않음
     * @return
     */
    public TravelShareInfo sharePublic(Optional<Duration> duration) {
        LocalDateTime expiredAt = null;
        if (duration.isPresent()) {
            expiredAt = LocalDateTime.now().plus(duration.get());
        }

        TravelShareInfo shareInfo = new TravelShareInfo(this, expiredAt);
        this.travelShareInfos.add(shareInfo);
        return shareInfo;
    }

    /**
     * 특정 Traveler에게 공유
     *
     * @param duration 공유시간, null이면 만료하지 않음
     * @param guest    초대 받을 사람
     * @return
     */
    public TravelShareInfo shareForMember(Optional<Duration> duration, Traveler guest) {
        LocalDateTime expiredAt = null;
        if (duration.isPresent()) {
            expiredAt = LocalDateTime.now().plus(duration.get());
        }

        TravelShareInfo shareInfo = new TravelShareInfo(this, guest, expiredAt);
        this.travelShareInfos.add(shareInfo);
        return shareInfo;
    }
}
