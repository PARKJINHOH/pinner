package com.example.travelmaprecodebe.controller;

import org.springframework.http.HttpHeaders;

public interface CommonHeader {
    static void withImmutableCache(org.springframework.http.HttpHeaders headers) {
        // 604800 -> week
        // 31536000 -> year
        headers.add(HttpHeaders.CACHE_CONTROL, "max-age=31536000, immutable");
    }
}
