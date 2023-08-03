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
            changeJourney(journey);
        }
    }

    public void changeJourney(Journey journey){
        this.journey = journey;
        journey.getPhotos().add(this);
    }
}
