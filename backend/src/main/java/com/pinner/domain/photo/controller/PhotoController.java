package com.pinner.domain.photo.controller;

import com.pinner.domain.photo.dto.PhotoResponse;
import com.pinner.domain.photo.service.PhotoService;
import com.pinner.domain.user.service.UserDetailsImpl;
import com.pinner.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/days/{dayId}/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping(consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<List<PhotoResponse>> upload(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId,
            @PathVariable Long dayId,
            @RequestParam("files") List<MultipartFile> files) {
        return ApiResponse.success(photoService.uploadPhotos(user.getUserId(), tripId, dayId, files));
    }

    @GetMapping
    public ApiResponse<List<PhotoResponse>> getPhotos(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId,
            @PathVariable Long dayId) {
        return ApiResponse.success(photoService.getPhotos(user.getUserId(), tripId, dayId));
    }

    @DeleteMapping("/{photoId}")
    public ApiResponse<Void> deletePhoto(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long tripId,
            @PathVariable Long dayId,
            @PathVariable Long photoId) {
        photoService.deletePhoto(user.getUserId(), tripId, dayId, photoId);
        return ApiResponse.success();
    }
}
