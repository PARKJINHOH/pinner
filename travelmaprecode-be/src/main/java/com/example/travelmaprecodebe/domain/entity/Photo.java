package com.example.travelmaprecodebe.domain.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

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

    private Long fileSize;

    private int width;

    private int height;

//    @JsonIgnore // 순환 참조 방지 (데이터가 없을 경우)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JOURNEY_ID")
    private Journey journey;

    @Builder
    public Photo(String originFileName, String fileName, String fullPath, Long fileSize, int width, int height) {
        this.fileName = fileName;
        this.originFileName = originFileName;
        this.fullPath = fullPath;
        this.fileSize = fileSize;
        this.width = width;
        this.height = height;
    }

    // Board 정보 저장
    public void addJourney(Journey journey){
        this.journey = journey;

        // 게시글에 현재 파일이 존재하지 않는다면
        if(!journey.getPhotos().contains(this))
            // 파일 추가
            journey.getPhotos().add(this);
    }
}
