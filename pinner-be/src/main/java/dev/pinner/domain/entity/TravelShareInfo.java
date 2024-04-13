package dev.pinner.domain.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Table(name = "TRAVEL_SHARE_INFO")
@NoArgsConstructor
public class TravelShareInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAVEL_ID")
    @Comment("여행")
    private Travel travel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAVELER_ID")
    @Comment("공유 받은 사람, 이 필드가 있으면 특정 맴버를 위한 공유임")
    private Traveler guest;

    @Column(unique = true)
    @Comment("공유 코드, 이 필드가 있으면 공개 공유임")
    private String shareCode;
    
    @Comment("만료 시간, NULL일 경우 만료하지 않음")
    private LocalDateTime expiredAt;

    public TravelShareInfo(Travel travel, LocalDateTime expiredAt) {
        this.travel = travel;
        /* need to longer to prevent brute force, perhaps? */
        this.shareCode = UUID.randomUUID().toString();
        this.expiredAt = expiredAt;
    }

    public TravelShareInfo(Travel travel, Traveler guest, LocalDateTime expiredAt) {
        this.travel = travel;
        this.guest = guest;
        /* need to longer to prevent brute force, perhaps? */
        this.shareCode = UUID.randomUUID().toString();
        this.expiredAt = expiredAt;
    }


    public Boolean isExpired() {
        if (expiredAt == null) {
            return false;
        }
        return LocalDateTime.now().isAfter(expiredAt);
    }
}
