package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.photo.InMemoryPhotoProvider;
import com.example.travelmaprecodebe.photo.SimplePhotoHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PhotoService {
    private final InMemoryPhotoProvider photoProvider;


    public String save(byte[] photo) {
        return photoProvider.save(new SimplePhotoHolder(photo));
    }

    public byte[] load(String s) {
        return  photoProvider.load(s).getData();
    }

}
