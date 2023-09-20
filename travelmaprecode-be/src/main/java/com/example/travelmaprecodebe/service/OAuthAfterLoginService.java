package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.utils.OnceReadTtlMap;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
public class OAuthAfterLoginService {
    private final OnceReadTtlMap<String, Long> map;

    public OAuthAfterLoginService() {
        this.map = new OnceReadTtlMap<>(
            value -> UUID.randomUUID().toString(),
            Duration.ofSeconds(60)
        );
    }

    public Long get(String id) {
        return map.get(id);
    }

    public String put(Long entry) {
        return map.put(entry);
    }
}
