package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Photo;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PhotoDto {
    private Long id;
    private String originFileName;
    private String fileName;
    private String fullPath;
    private String src;
    private Long fileSize;
    private int width;
    private int height;

    @Builder
    public PhotoDto(String originFileName, String fileName, String fullPath, String src, Long fileSize, int width, int height) {
        this.originFileName = originFileName;
        this.fileName = fileName;
        this.fullPath = fullPath;
        this.src = src;
        this.fileSize = fileSize;
        this.width = width;
        this.height = height;
    }

    public PhotoDto(Photo photo) {
        this.id = photo.getId();
        this.src = photo.getSrc();
        this.fileName = photo.getFileName();
        this.width = photo.getWidth();
        this.height = photo.getHeight();
    }

    public Photo toEntity() {
        return Photo.builder()
                .fileName(fileName)
                .originFileName(originFileName)
                .fullPath(fullPath)
                .src(src)
                .fileSize(fileSize)
                .width(width)
                .height(height)
                .build();
    }
}

