package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.photo.DiskPhotoProvider;
import com.example.travelmaprecodebe.photo.SimplePhotoHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PhotoService {
    private final DiskPhotoProvider photoProvider;

    public PhotoService(@Value("${photo-service.base-path}") String basePath) {
        photoProvider = new DiskPhotoProvider(basePath);
    }

    public String save(byte[] photo) {
        return photoProvider.save(new SimplePhotoHolder(photo));
    }

    public byte[] load(String s) {
        return photoProvider.load(s).getData();
    }

}
