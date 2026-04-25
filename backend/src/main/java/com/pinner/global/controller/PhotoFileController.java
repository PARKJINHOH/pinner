package com.pinner.global.controller;

import com.pinner.domain.photo.entity.Photo;
import com.pinner.domain.photo.service.PhotoService;
import com.pinner.domain.user.service.UserDetailsImpl;
import com.pinner.global.exception.BusinessException;
import com.pinner.global.exception.ErrorCode;
import com.pinner.global.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoFileController {

    private static final Map<String, String> CONTENT_TYPES = Map.of(
            "jpg", "image/jpeg",
            "jpeg", "image/jpeg",
            "png", "image/png",
            "webp", "image/webp",
            "heic", "image/heic"
    );

    private final PhotoService photoService;
    private final StorageService storageService;

    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> servePhoto(
            @PathVariable String fileName,
            @AuthenticationPrincipal UserDetailsImpl user) {

        Photo photo = photoService.findPhotoForServing(fileName);

        if (!photo.getUser().getId().equals(user.getUserId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        String fullPath = storageService.getFullPath(photo.getFilePath());
        Resource resource = new FileSystemResource(Paths.get(fullPath));

        if (!resource.exists()) {
            throw new BusinessException(ErrorCode.PHOTO_NOT_FOUND);
        }

        String ext = fileName.contains(".")
                ? fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
                : "jpg";
        String contentType = CONTENT_TYPES.getOrDefault(ext, "image/jpeg");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
