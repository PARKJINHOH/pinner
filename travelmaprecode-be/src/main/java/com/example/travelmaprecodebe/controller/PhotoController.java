package com.example.travelmaprecodebe.controller;

import com.example.travelmaprecodebe.domain.dto.ResponseDto;
import com.example.travelmaprecodebe.service.PhotoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PhotoController {
    private final PhotoService photoService;

    @PostMapping("/photo/journey/{saveJourneyId}")
    public ResponseEntity<?> postPhoto(@PathVariable Long saveJourneyId, @RequestParam("photo") List<MultipartFile> photos) {
        try {
            photoService.save(saveJourneyId, photos);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (IOException e) {
            log.error("failed to save photo" + e);
            return new ResponseEntity<>(
                new ResponseDto("invalidate image format. We only accept jpg and png."),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping(value = "/photo/{fileName}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<?> getPhoto(@PathVariable String fileName) throws IOException {
        String pullPath = photoService.findPhotoByFileName(fileName);
        String absolutePath = new File("").getAbsolutePath() + File.separator;

        Path imagePath = Paths.get(absolutePath + pullPath);
        byte[] imageByteArray = Files.readAllBytes(imagePath);

        return new ResponseEntity<>(imageByteArray, HttpStatus.OK);
    }
}
