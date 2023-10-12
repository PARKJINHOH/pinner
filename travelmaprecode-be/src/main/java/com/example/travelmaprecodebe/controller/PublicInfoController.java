package com.example.travelmaprecodebe.controller;

import com.example.travelmaprecodebe.bulidinfo.CustomGitProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.info.BuildProperties;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/public", produces = MediaType.APPLICATION_JSON_VALUE)
public class PublicInfoController {
    private final CustomGitProperties customGitProperties;
    private final BuildProperties buildProperties;

    @GetMapping("/info")
    ResponseEntity<?> buildInfo() {
        return ResponseEntity.ok(Map.of(
            "gitInfo", customGitProperties,
            "builtAt", buildProperties.getTime()
        ));
    }
}
