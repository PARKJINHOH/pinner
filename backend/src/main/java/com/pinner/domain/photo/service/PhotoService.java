package com.pinner.domain.photo.service;

import com.pinner.domain.day.entity.TripDay;
import com.pinner.domain.day.repository.TripDayRepository;
import com.pinner.domain.marker.entity.Marker;
import com.pinner.domain.marker.repository.MarkerRepository;
import com.pinner.domain.photo.dto.PhotoResponse;
import com.pinner.domain.photo.entity.Photo;
import com.pinner.domain.photo.repository.PhotoRepository;
import com.pinner.domain.trip.repository.TripRepository;
import com.pinner.domain.user.entity.User;
import com.pinner.domain.user.repository.UserRepository;
import com.pinner.global.exception.BusinessException;
import com.pinner.global.exception.ErrorCode;
import com.pinner.global.storage.StorageService;
import com.pinner.global.util.ExifData;
import com.pinner.global.util.ExifExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "heic", "webp");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024L;
    private static final int MAX_PHOTOS_PER_DAY = 10;

    private final PhotoRepository photoRepository;
    private final TripRepository tripRepository;
    private final TripDayRepository tripDayRepository;
    private final MarkerRepository markerRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;
    private final ExifExtractor exifExtractor;

    @Value("${storage.max-file-size:5242880}")
    private long maxFileSize;

    @Transactional
    public List<PhotoResponse> uploadPhotos(Long userId, Long tripId, Long dayId, List<MultipartFile> files) {
        TripDay day = verifyDayOwnership(userId, tripId, dayId);

        long existingCount = photoRepository.countByDayId(dayId);
        if (existingCount + files.size() > MAX_PHOTOS_PER_DAY) {
            throw new BusinessException(ErrorCode.FILE_COUNT_EXCEEDED);
        }

        for (MultipartFile file : files) {
            validateFile(file);
        }

        User user = userRepository.getReferenceById(userId);
        boolean hasMarker = markerRepository.existsByTripDay_IdAndDeletedAtIsNull(dayId);
        BigDecimal firstGpsLat = null, firstGpsLng = null;
        List<Photo> savedPhotos = new ArrayList<>();

        for (MultipartFile file : files) {
            String ext = getExtension(file.getOriginalFilename());
            String uuid = UUID.randomUUID().toString();
            String fileName = uuid + "." + ext;
            String relativePath = userId + "/" + dayId + "/" + fileName;

            ExifData exif = exifExtractor.extract(file);

            storageService.upload(file, relativePath);
            BigDecimal lat = exif.getLat() != null ? BigDecimal.valueOf(exif.getLat()) : null;
            BigDecimal lng = exif.getLng() != null ? BigDecimal.valueOf(exif.getLng()) : null;

            Photo photo = Photo.of(day, user, fileName,
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : fileName,
                    file.getSize(), relativePath, lat, lng, exif.getTakenAt());
            photoRepository.save(photo);
            savedPhotos.add(photo);

            if (!hasMarker && firstGpsLat == null && lat != null && lng != null) {
                firstGpsLat = lat;
                firstGpsLng = lng;
            }
        }

        if (!hasMarker && firstGpsLat != null) {
            Marker marker = Marker.ofAuto(day, user, firstGpsLat, firstGpsLng);
            markerRepository.save(marker);
        }

        return savedPhotos.stream().map(PhotoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<PhotoResponse> getPhotos(Long userId, Long tripId, Long dayId) {
        verifyDayOwnership(userId, tripId, dayId);
        return photoRepository.findSortedPhotos(userId, dayId)
                .stream().map(PhotoResponse::from).toList();
    }

    @Transactional
    public void deletePhoto(Long userId, Long tripId, Long dayId, Long photoId) {
        verifyDayOwnership(userId, tripId, dayId);

        Photo photo = photoRepository.findById(photoId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new BusinessException(ErrorCode.PHOTO_NOT_FOUND));

        if (!photo.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        boolean hadGps = photo.hasGps();
        photo.softDelete();

        if (hadGps) {
            long remainingGps = photoRepository.countGpsPhotosByDayId(dayId);
            if (remainingGps == 0) {
                markerRepository.findByTripDay_IdAndDeletedAtIsNull(dayId)
                        .filter(Marker::isAuto)
                        .ifPresent(Marker::softDelete);
            }
        }
    }

    public Photo findPhotoForServing(String fileName) {
        return photoRepository.findByFileNameAndDeletedAtIsNull(fileName)
                .orElseThrow(() -> new BusinessException(ErrorCode.PHOTO_NOT_FOUND));
    }

    private TripDay verifyDayOwnership(Long userId, Long tripId, Long dayId) {
        tripRepository.findByIdAndUser_IdAndDeletedAtIsNull(tripId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_NOT_FOUND));

        return tripDayRepository.findByIdAndUser_IdAndDeletedAtIsNull(dayId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_DAY_NOT_FOUND));
    }

    private void validateFile(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED);
        }
        String ext = getExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }
    }

    private String getExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }
        return originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
    }
}
