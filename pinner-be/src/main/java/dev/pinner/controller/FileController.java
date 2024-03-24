package dev.pinner.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/file")
public class FileController {

    /**
     * 파일 업로드
     */
    @PostMapping("/upload")
    public void upload() {
        log.info("upload");
    }

    /**
     * 파일 다운로드
     */
    @PostMapping("/download")
    public void download() {
        log.info("download");
    }

}
