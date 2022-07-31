package com.example.travelmaprecodebe.domain.image;

import com.example.travelmaprecodebe.domain.traveler.ResponseDto;
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
public class ImageController {
    private final ImageService imageService;

    @PostMapping("/images")
    public ResponseEntity<?> postImage(
            @RequestParam("image") MultipartFile file
    ){
        try {
            // 이미 있는 이미지가 올라와도 충돌시키지 않는다.
            final String imageLink = imageService.save(file.getBytes());
            return new ResponseEntity<>(Map.of("links", imageLink), HttpStatus.CREATED);
        } catch (IOException e) {
            log.error("failed to save image" + e.toString());
            return new ResponseEntity<>(new ResponseDto("something wrong"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/images/{id}")
    public ResponseEntity<?> getImage(
            @PathVariable String id
    ) {
        byte[] load = imageService.load(id);
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
