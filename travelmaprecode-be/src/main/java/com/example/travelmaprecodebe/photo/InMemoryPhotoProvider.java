package com.example.travelmaprecodebe.photo;

import com.google.common.hash.Hashing;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@ConditionalOnProperty(name="photo-service.provider", havingValue = "memory")
public class InMemoryPhotoProvider implements PhotoProvider<String, SimplePhotoHolder> {
    private final Map<String, SimplePhotoHolder> store = new ConcurrentHashMap<>();

    public InMemoryPhotoProvider() {
        log.info("Using InMemoryPhotoProvider as PhotoProvider");
    }

    @Override
    public String save(SimplePhotoHolder photo) {
        String hashCode = Hashing.sha256().hashBytes(photo.getData()).toString();
        store.putIfAbsent(hashCode, photo);
        return hashCode;
    }

    @Override
    public SimplePhotoHolder load(String s) {
        return store.get(s);
    }
}
