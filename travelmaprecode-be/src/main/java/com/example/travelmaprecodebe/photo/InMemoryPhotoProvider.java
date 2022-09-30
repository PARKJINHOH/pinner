package com.example.travelmaprecodebe.photo;

import com.google.common.hash.Hashing;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryPhotoProvider implements PhotoProvider<String, SimplePhotoHolder> {
    private final Map<String, SimplePhotoHolder> store = new ConcurrentHashMap<>();


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
