package dev.pinner.domain.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "EMAIL_SMTP")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmailSMTP extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Comment("수신자")
    private String to;

    @Comment("메일 제목")
    private String subject;

    @Comment("메일 내용")
    private String message;

    @Comment("타입")
    private String type;

    @Builder
    public EmailSMTP(String to, String subject, String message, String type) {
        this.to = to;
        this.subject = subject;
        this.message = message;
        this.type = type;
    }
}
