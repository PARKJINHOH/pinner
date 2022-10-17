package com.example.travelmaprecodebe.controller;

import com.example.travelmaprecodebe.global.ResponseDto;
import com.example.travelmaprecodebe.service.PhotoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PhotoController {
    private final PhotoService photoService;

    @PostMapping("/photo")
    public ResponseEntity<?> postPhoto(
            @RequestParam("photo") MultipartFile file
    ){
        try {
            // 이미 있는 이미지가 올라와도 충돌시키지 않는다.
            final String photoLink = photoService.save(file.getInputStream());
            log.info("photo saved: {}", photoLink);
            return new ResponseEntity<>(Map.of("link", photoLink), HttpStatus.CREATED);
        } catch (IOException e) {
            log.error("failed to save photo" + e);
            return new ResponseEntity<>(
                    new ResponseDto("invalidate image format. We only accept jpg and png."),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping("/photo/{id}")
    public ResponseEntity<?> getPhoto(
            @PathVariable String id
    ) {
        byte[] load = photoService.load(id);
        if (load == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(load);
        }
    }
}
