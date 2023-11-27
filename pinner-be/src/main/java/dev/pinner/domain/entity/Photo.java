package dev.pinner.domain.entity;

import dev.pinner.exception.CustomException;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.springframework.http.HttpStatus;

import javax.persistence.*;
import java.io.File;

@Entity
@Getter
@Table(name = "PHOTO")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Photo extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Comment("사진이름(암호화)")
    @Column(nullable = false)
    private String fileName;

    @Comment("사진이름(실제)")
    @Column(nullable = false)
    private String originFileName;

    @Comment("사진 경로")
    @Column(nullable = false)
    private String fullPath;

    @Comment("사진 URI")
    @Column(nullable = false)
    private String src;

    @Comment("사진 사이즈(kb)")
    private Long fileSize;

    @Comment("사진 가로 길이")
    private int width;

    @Comment("사진 세로 길이")
    private int height;

    @Comment("여정")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JOURNEY_ID")
    private Journey journey;

    @Builder
    public Photo(String originFileName, String fileName, String fullPath, String src, Long fileSize, int width, int height, Journey journey) {
        this.fileName = fileName;
        this.originFileName = originFileName;
        this.fullPath = fullPath;
        this.src = src;
        this.fileSize = fileSize;
        this.width = width;
        this.height = height;
        if (journey != null) {
            setJourney(journey);
        }
    }

    public void setJourney(Journey journey) {
        // 연관 관계 편의 메소드
        if (this.journey != null) {
            this.journey.getPhotos().remove(this);
        }

        this.journey = journey;
        journey.getPhotos().add(this);
    }

    public void deleteImageFile() {
        if (fullPath != null) {
            String absolutePath = new File("").getAbsolutePath() + File.separator;
            File fileToDelete = new File(absolutePath + fullPath);
            if (!fileToDelete.delete()) {
                throw new CustomException(HttpStatus.UNAUTHORIZED, "사진 삭제 진행중 문제가 발생했습니다.");
            }
        }
    }
}
