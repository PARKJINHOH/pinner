package dev.pinner.service.oauth;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

public class OnceReadTtlMap<K, V> {
    private final ConcurrentHashMap<K, TtlValueWrapper<V>> map = new ConcurrentHashMap<>();
    private final KeyGenerator<K, V> keyGenerator;
    private final Duration duration;


    /**
     * 유효기간을 가진, 각 엔트리를 한번만 읽을 수 있는 OnceReadTtlMap 생성
     *
     * @param keyGenerator 값을 받아 키를 생성하는 객체
     * @param duration     유효기간
     */
    public OnceReadTtlMap(KeyGenerator<K, V> keyGenerator, Duration duration) {
        this.keyGenerator = keyGenerator;
        this.duration = duration;
    }


    public V get(K id) {
        if (!map.containsKey(id)) {
            return null;
        }

        TtlValueWrapper<V> wrapper = map.get(id);
        if (wrapper.isExpired()) {
            map.remove(id);
            return null;
        }

        map.remove(id);
        return wrapper.value;
    }

    public K put(V entry) {
        final TtlValueWrapper<V> wrapper = new TtlValueWrapper<V>(entry, duration);
        final K id = keyGenerator.generateKey(entry);

        map.put(id, wrapper);

        return id;
    }


    /**
     * 메모리 소비를 줄이기 위해 유효기간이 지난 모든 키를 삭제합니다.
     */
    public void prune() {
        map.forEach((k, v) -> {
            if (v.isExpired()) {
                map.remove(k);
            }
        });
    }


    private static class TtlValueWrapper<V> {
        final V value;
        final LocalDateTime validUntil;

        public TtlValueWrapper(V value, Duration duration) {
            this.value = value;
            this.validUntil = LocalDateTime.now().plus(duration);
        }

        boolean isExpired() {
            return validUntil.isBefore(LocalDateTime.now());
        }
    }

    @FunctionalInterface
    public interface KeyGenerator<K, V> {
        K generateKey(V value);
    }
}
