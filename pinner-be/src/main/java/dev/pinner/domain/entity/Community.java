package dev.pinner.domain.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Table(name = "COMMUNITY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Community extends AuditEntity {

    @Id
    @Column(name = "COMMUNITY_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(length = 50)
    @Comment("제목")
    private String title;

    @Lob
    @Comment("내용")
    private String content;

    @NotNull
    @Comment("작성자")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAVELER_ID")
    private Traveler traveler;

    @Column(length = 1000)
    @Comment("조회수")
    private int viewCount;

    @Comment("상태(N : 미노출, Y : 노출)")
    private String status;


    @Builder
    public Community(String title, String content, Traveler traveler) {
        this.title = title;
        this.content = content;
        this.traveler = traveler;
    }
}
