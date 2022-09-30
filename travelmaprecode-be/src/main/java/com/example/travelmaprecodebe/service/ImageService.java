package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.image.InMemoryImageProvider;
import com.example.travelmaprecodebe.image.SimpleImageHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final InMemoryImageProvider imageProvider;


    public String save(byte[] image) {
        return imageProvider.save(new SimpleImageHolder(image));
    }

    public byte[] load(String s) {
        return  imageProvider.load(s).getData();
    }

}
