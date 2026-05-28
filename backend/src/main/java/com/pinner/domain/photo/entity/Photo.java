package com.pinner.domain.photo.entity;

import com.pinner.domain.day.entity.TripDay;
import com.pinner.domain.user.entity.User;
import com.pinner.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(
        name = "photos",
        indexes = {
                @Index(name = "idx_photos_trip_day_id", columnList = "trip_day_id"),
                @Index(name = "idx_photos_sort", columnList = "trip_day_id, exif_taken_at, uploaded_at")
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Photo extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_day_id", nullable = false)
    private TripDay tripDay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "original_name", nullable = false, length = 255)
    private String originalName;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    // 상대경로: userId/tripDayId/uuid.jpg
    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "lat", precision = 10, scale = 7)
    private BigDecimal lat;

    @Column(name = "lng", precision = 10, scale = 7)
    private BigDecimal lng;

    @Column(name = "exif_taken_at")
    private LocalDateTime exifTakenAt;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    private Photo(TripDay tripDay, User user, String fileName, String originalName,
                  Long fileSize, String filePath, BigDecimal lat, BigDecimal lng,
                  LocalDateTime exifTakenAt) {
        this.tripDay = tripDay;
        this.user = user;
        this.fileName = fileName;
        this.originalName = originalName;
        this.fileSize = fileSize;
        this.filePath = filePath;
        this.lat = lat;
        this.lng = lng;
        this.exifTakenAt = exifTakenAt;
        this.uploadedAt = LocalDateTime.now();
    }

    public static Photo of(TripDay tripDay, User user, String fileName, String originalName,
                           Long fileSize, String filePath, BigDecimal lat, BigDecimal lng,
                           LocalDateTime exifTakenAt) {
        return new Photo(tripDay, user, fileName, originalName,
                fileSize, filePath, lat, lng, exifTakenAt);
    }

    public boolean hasGps() {
        return lat != null && lng != null;
    }
}
