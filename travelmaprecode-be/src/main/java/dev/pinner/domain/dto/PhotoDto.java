package dev.pinner.domain.dto;

import dev.pinner.domain.entity.Photo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


public class PhotoDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request {
        private Long id;
        private String originFileName;
        private String fileName;
        private String fullPath;
        private String src;
        private Long fileSize;
        private int width;
        private int height;

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

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String src;
        private Long fileSize;
        private int width;
        private int height;

        public Response(Photo photo) {
            this.id = photo.getId();
            this.src = photo.getSrc();
            this.fileSize = photo.getFileSize();
            this.width = photo.getWidth();
            this.height = photo.getHeight();
        }
    }

}

