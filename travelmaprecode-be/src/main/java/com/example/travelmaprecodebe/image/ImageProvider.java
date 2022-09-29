package com.example.travelmaprecodebe.image;

public interface ImageProvider<Key, Image extends ImageHolder> {
    Key save(Image image);
    Image load(Key key);
}
