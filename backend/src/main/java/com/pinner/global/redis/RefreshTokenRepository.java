package com.pinner.global.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RefreshTokenRepository {

    private static final String KEY_PREFIX = "refresh:";

    private final RedisTemplate<String, String> redisTemplate;

    public void save(Long userId, String refreshToken, Duration duration, boolean isDemo) {
        String value = userId + ":" + isDemo;
        redisTemplate.opsForValue().set(KEY_PREFIX + refreshToken, value, duration);
    }

    public Optional<RefreshPayload> find(String refreshToken) {
        String raw = redisTemplate.opsForValue().get(KEY_PREFIX + refreshToken);
        if (raw == null) return Optional.empty();
        String[] parts = raw.split(":", 2);
        Long userId = Long.parseLong(parts[0]);
        boolean isDemo = parts.length > 1 && Boolean.parseBoolean(parts[1]);
        return Optional.of(new RefreshPayload(userId, isDemo));
    }

    public void delete(String refreshToken) {
        redisTemplate.delete(KEY_PREFIX + refreshToken);
    }

    public record RefreshPayload(Long userId, boolean isDemo) {}
}
