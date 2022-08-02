package com.example.travelmaprecodebe.domain.image;

import com.google.common.hash.Hashing;
import lombok.Getter;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryRestrictedImageProvider implements ImageProvider<KeyAndAuthData, ImageAndAuthHolder> {

    private final Map<String, ImgAndAuthData> store = new ConcurrentHashMap<>();

    @Getter
    static class ImgAndAuthData {
        private final byte[] image;
        private final Set<String> owners = new HashSet<>();

        public ImgAndAuthData(byte[] image, String owner) {
            this.image = image;
            addOwner(owner);
        }

        void addOwner(String owner) {
            this.owners.add(owner);
        }

        boolean isOwnedBy(String owner) {
            return owners.contains(owner);
        }
    }

    @Override
    public KeyAndAuthData save(ImageAndAuthHolder image) {
        String hashCode = Hashing.sha256().hashBytes(image.getData()).toString();

        ImgAndAuthData data = store.get(hashCode);
        if (data == null) {
            store.put(hashCode, new ImgAndAuthData(image.getData(), image.getOwner()));
        } else {
            data.addOwner(image.getOwner());
        }

        return new KeyAndAuthData(hashCode, image.getOwner());
    }

    @Override
    public ImageAndAuthHolder load(KeyAndAuthData keyAndAuthData) {
        final String owner = keyAndAuthData.getEmail();
        final ImgAndAuthData data = store.get(keyAndAuthData.getKey());
        if (data != null && data.isOwnedBy(owner)) {
            return new ImageAndAuthHolder(data.getImage(), owner);
        }
        return null;
    }
}
