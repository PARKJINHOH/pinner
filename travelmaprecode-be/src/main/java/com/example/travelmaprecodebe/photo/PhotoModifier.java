package com.example.travelmaprecodebe.photo;

public interface PhotoModifier<Photo> {
    Photo resize(Photo photo, int height, int width);
    Photo format(Photo photo, PhotoFormat format);
}
