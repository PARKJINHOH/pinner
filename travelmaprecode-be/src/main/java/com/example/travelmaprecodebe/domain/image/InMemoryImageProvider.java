package com.example.travelmaprecodebe.domain.image;

import com.google.common.hash.Hashing;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryImageProvider implements ImageProvider<String, SimpleImageHolder> {
    private final Map<String, SimpleImageHolder> store = new ConcurrentHashMap<>();


    @Override
    public String save(SimpleImageHolder image) {
        String hashCode = Hashing.sha256().hashBytes(image.getData()).toString();
        store.putIfAbsent(hashCode, image);
        return hashCode;
    }

    @Override
    public SimpleImageHolder load(String s) {
        return store.get(s);
    }
}
