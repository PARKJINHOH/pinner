package dev.pinner.domain.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Getter
@Table(name = "NOTICE")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notice extends AuditEntity {

    @Id
    private Long id;

    @Comment("제목")
    private String title;

    @Comment("내용")
    private String content;

    @Comment("작성자")
    private String writer;

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
}
