package com.example.travelmaprecodebe.photo;

import com.google.common.hash.Hashing;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Path;

@Slf4j
@Component
@ConditionalOnProperty(name="photo-service.provider", havingValue = "disk")
public class DiskPhotoProvider implements PhotoProvider<String, SimplePhotoHolder> {
    private final String basePath;

    public DiskPhotoProvider(@Value("${photo-service.base-path}") String basePath) {
        log.info("Using DiskPhotoProvider as PhotoProvider");
        this.basePath = basePath;
    }

    @Override
    public String save(SimplePhotoHolder photo) {
        String hashCode = Hashing.sha256().hashBytes(photo.getData()).toString();
        File file = getFile(hashCode);

        if (!file.exists()) {
            try (FileOutputStream outputStream = new FileOutputStream(file)) {
                outputStream.write(photo.getData());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return hashCode;
    }

    @Override
    public SimplePhotoHolder load(String photoId) {
        File file = getFile(photoId);

        try (InputStream inputStream = new FileInputStream(file)) {
            return new SimplePhotoHolder(inputStream.readAllBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private File getFile(String hashCode) {
        Path path = Path.of(basePath, hashCode);
        return new File(path.toString());
    }
}
