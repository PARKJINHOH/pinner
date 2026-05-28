package com.pinner.global.util;

import com.drew.imaging.ImageMetadataReader;
import com.drew.lang.GeoLocation;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.drew.metadata.exif.GpsDirectory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.TimeZone;

@Slf4j
@Component
public class ExifExtractor {

    public ExifData extract(MultipartFile file) {
        try (var is = file.getInputStream()) {
            Metadata metadata = ImageMetadataReader.readMetadata(is);

            Double lat = null;
            Double lng = null;
            LocalDateTime takenAt = null;

            GpsDirectory gpsDir = metadata.getFirstDirectoryOfType(GpsDirectory.class);
            if (gpsDir != null) {
                GeoLocation location = gpsDir.getGeoLocation();
                if (location != null && !location.isZero()) {
                    lat = location.getLatitude();
                    lng = location.getLongitude();
                }
            }

            ExifSubIFDDirectory exifDir = metadata.getFirstDirectoryOfType(ExifSubIFDDirectory.class);
            if (exifDir != null) {
                Date date = exifDir.getDate(
                        ExifSubIFDDirectory.TAG_DATETIME_ORIGINAL,
                        TimeZone.getDefault()
                );
                if (date != null) {
                    takenAt = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                }
            }

            return ExifData.of(lat, lng, takenAt);

        } catch (Exception e) {
            log.debug("EXIF 추출 실패 (파일: {}): {}", file.getOriginalFilename(), e.getMessage());
            return ExifData.empty();
        }
    }
}
