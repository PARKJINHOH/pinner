package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.photo.PhotoProvider;
import com.example.travelmaprecodebe.photo.SimplePhotoHolder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhotoService {
    @Autowired
    private final PhotoProvider<String, SimplePhotoHolder> photoProvider;

    public String save(byte[] photo) {
        return photoProvider.save(new SimplePhotoHolder(photo));
    }

    public byte[] load(String s) {
        return photoProvider.load(s).getData();
    }

}
