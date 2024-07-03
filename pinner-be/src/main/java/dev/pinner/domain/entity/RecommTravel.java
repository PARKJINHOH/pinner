package dev.pinner.domain.entity;

import dev.pinner.domain.dto.NoticeDto;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Table(name = "RECOMM_TRAVEL")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecommTravel extends AuditEntity {

    @Id
    @Column(name = "RECOMM_TRAVEL_ID")
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
    @Column(length = 50)
    @Comment("작성자")
    private String writer;

    @Column(length = 1000)
    @Comment("조회수")
    private int viewCount;

    @Comment("상태(N : 미노출, Y : 노출)")
    private String status;

    @Builder
    public RecommTravel(String title, String content, String writer) {
        this.title = title;
        this.content = content;
        this.writer = writer;
    }
}
