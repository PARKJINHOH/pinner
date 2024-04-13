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
@Table(name = "NOTICE")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notice extends AuditEntity {

    @Id
    @Column(name = "NOTICE_ID")
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

    @Comment("공지사항 상태")
    private String status;

    @Comment("공지사항 시작일")
    private String startDate;

    @Comment("공지사항 종료일")
    private String endDate;

    @Builder
    public Notice(String title, String content, String writer) {
        this.title = title;
        this.content = content;
        this.writer = writer;
    }

    public void update(NoticeDto.Request noticeDto) {
        this.title = noticeDto.getTitle();
        this.content = noticeDto.getContent();
        this.writer = noticeDto.getWriter();
    }
}
