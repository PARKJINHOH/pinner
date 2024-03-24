package dev.pinner.domain.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "FILE")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class File extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Comment("파일 시퀀스")
    private Long fileSeq;

    @Comment("파일이름(암호화)")
    @Column(nullable = false)
    private String fileName;

    @Comment("사진이름(실제)")
    @Column(nullable = false)
    private String originFileName;

    @Comment("파일 경로")
    @Column(nullable = false)
    private String fullPath;

    @Comment("웹 경로")
    @Column(nullable = false)
    private String webPath;

    @Comment("파일 사이즈")
    private Long fileSize;

    @Comment("파일 확장자")
    private String extension;

    @Comment("파일 저장 확정 여부")
    private boolean confirmed;
}
