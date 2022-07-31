package com.example.travelmaprecodebe.domain.image;

import com.google.common.hash.Hashing;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class InMemoryImageProvider implements ImageProvider<String> {
    private final Map<String, ImageHolder> store = new HashMap<>();


    static class ImageHolder {
        final byte[] image;

        public ImageHolder(byte[] image) {
            this.image = image;
        }

        public byte[] getImage() {
            return image;
        }
    }

    @Override
    public String save(byte[] image) {
        String hashCode = Hashing.sha256().hashBytes(image).toString();
        store.putIfAbsent(hashCode, new ImageHolder(image));
        return hashCode;
    }

    @Override
    public byte[] load(String s) {
        ImageHolder imageHolder = store.get(s);
        if (imageHolder != null) {
            return imageHolder.image;
        }
        return null;
    }
}
