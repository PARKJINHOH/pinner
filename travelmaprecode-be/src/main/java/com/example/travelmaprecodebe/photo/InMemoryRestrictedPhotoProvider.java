package com.example.travelmaprecodebe.photo;

import com.google.common.hash.Hashing;
import lombok.Getter;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryRestrictedPhotoProvider implements PhotoProvider<KeyAndAuthData, PhotoAndAuthHolder> {

    private final Map<String, ImgAndAuthData> store = new ConcurrentHashMap<>();

    @Getter
    static class ImgAndAuthData {
        private final byte[] photo;
        private final Set<String> owners = new HashSet<>();

        public ImgAndAuthData(byte[] photo, String owner) {
            this.photo = photo;
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
    public KeyAndAuthData save(PhotoAndAuthHolder photo) {
        String hashCode = Hashing.sha256().hashBytes(photo.getData()).toString();

        ImgAndAuthData data = store.get(hashCode);
        if (data == null) {
            store.put(hashCode, new ImgAndAuthData(photo.getData(), photo.getOwner()));
        } else {
            data.addOwner(photo.getOwner());
        }

        return new KeyAndAuthData(hashCode, photo.getOwner());
    }

    @Override
    public PhotoAndAuthHolder load(KeyAndAuthData keyAndAuthData) {
        final String owner = keyAndAuthData.getEmail();
        final ImgAndAuthData data = store.get(keyAndAuthData.getKey());
        if (data != null && data.isOwnedBy(owner)) {
            return new PhotoAndAuthHolder(data.getPhoto(), owner);
        }
        return null;
    }
}
