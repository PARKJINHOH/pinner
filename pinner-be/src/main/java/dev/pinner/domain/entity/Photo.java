package dev.pinner.domain.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.File;

@Entity
@Getter
@Table(name = "PHOTO")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String originFileName;

    @Column(nullable = false)
    private String fullPath;

    @Column(nullable = false)
    private String src;

    private Long fileSize;

    private int width;

    private int height;

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
            try {
                String absolutePath = new File("").getAbsolutePath() + File.separator;
                File fileToDelete = new File(absolutePath + fullPath);
                if (fileToDelete.delete()) {
                    System.out.println("Image file deleted successfully: " + absolutePath + fullPath);
                } else {
                    System.out.println("Failed to delete image file: " + absolutePath + fullPath);
                }
            } catch (Exception e) {
                System.out.println("Error deleting image file");
                e.printStackTrace();
            }
        }
    }
}
