package com.example.travelmaprecodebe.image;

public interface ImageModifier<Image> {
    Image resize(Image image, int height, int width);
    Image format(Image image, ImageFormat format);
}
