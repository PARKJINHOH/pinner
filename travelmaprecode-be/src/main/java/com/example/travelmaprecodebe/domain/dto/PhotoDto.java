package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Photo;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PhotoDto {
    private String originFileName;
    private String newFileName;
    private String fullPath;
    private Long fileSize;
    private int width;
    private int height;

    @Builder
    public PhotoDto(String originFileName, String newFileName, String fullPath, Long fileSize, int width, int height) {
        this.originFileName = originFileName;
        this.fullPath = fullPath;
        this.fileSize = fileSize;
        this.width = width;
        this.height = height;
    }

    public PhotoDto(Photo photo) {
        this.originFileName = photo.getOriginFileName();
        this.fullPath = photo.getFullPath();
        this.fileSize = photo.getFileSize();
        this.width = photo.getWidth();
        this.height = photo.getHeight();
    }

    public Photo toEntity() {
        return Photo.builder()
                .originFileName(originFileName)
                .fullPath(fullPath)
                .fileSize(fileSize)
                .width(width)
                .height(height)
                .build();
    }
}

