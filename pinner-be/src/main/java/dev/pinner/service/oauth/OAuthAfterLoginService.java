package dev.pinner.service.oauth;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
public class OAuthAfterLoginService {
    private final OnceReadTtlMap<String, String> map;

    public OAuthAfterLoginService() {
        this.map = new OnceReadTtlMap<>(
            value -> UUID.randomUUID().toString(),
            Duration.ofSeconds(60)
        );
    }

    public String get(String id) {
        return map.get(id);
    }

    public String put(String entry) {
        return map.put(entry);
    }
}
