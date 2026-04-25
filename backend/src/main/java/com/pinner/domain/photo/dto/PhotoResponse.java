package com.pinner.domain.photo.dto;

import com.pinner.domain.photo.entity.Photo;

import java.time.LocalDateTime;

public record PhotoResponse(
        Long photoId,
        Long dayId,
        String fileName,
        String originalName,
        Long fileSize,
        String fileUrl,
        Double lat,
        Double lng,
        LocalDateTime exifTakenAt,
        LocalDateTime uploadedAt,
        boolean hasGps
) {
    public static PhotoResponse from(Photo photo) {
        return new PhotoResponse(
                photo.getId(),
                photo.getTripDay().getId(),
                photo.getFileName(),
                photo.getOriginalName(),
                photo.getFileSize(),
                "/api/photos/" + photo.getFileName(),
                photo.getLat() != null ? photo.getLat().doubleValue() : null,
                photo.getLng() != null ? photo.getLng().doubleValue() : null,
                photo.getExifTakenAt(),
                photo.getUploadedAt(),
                photo.hasGps()
        );
    }
}
