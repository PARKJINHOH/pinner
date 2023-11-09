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
    @Column(name = "EMAIL_SMTP_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Comment("수신자")
    private String recipient;

    @Comment("메일 제목")
    private String subject;

    @Comment("메일 내용")
    private String message;

    @Comment("코드")
    private String code;

    @Comment("타입")
    private String emailType;

    @Builder
    public EmailSMTP(String recipient, String subject, String message, String code, String emailType) {
        this.recipient = recipient;
        this.subject = subject;
        this.message = message;
        this.code = code;
        this.emailType = emailType;
    }
}
