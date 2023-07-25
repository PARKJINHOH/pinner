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
    private Long fileSize;
    private int width;
    private int height;

    @Builder
    public PhotoDto(String originFileName, String fileName, String fullPath, Long fileSize, int width, int height) {
        this.originFileName = originFileName;
        this.fileName = fileName;
        this.fullPath = fullPath;
        this.fileSize = fileSize;
        this.width = width;
        this.height = height;
    }

    public PhotoDto(Photo photo) {
        this.id = photo.getId();
        this.originFileName = photo.getOriginFileName();
        this.fileName = photo.getFileName();
        this.fullPath = photo.getFullPath();
        this.fileSize = photo.getFileSize();
        this.width = photo.getWidth();
        this.height = photo.getHeight();
    }

    public Photo toEntity() {
        return Photo.builder()
                .fileName(fileName)
                .originFileName(originFileName)
                .fullPath(fullPath)
                .fileSize(fileSize)
                .width(width)
                .height(height)
                .build();
    }
}

