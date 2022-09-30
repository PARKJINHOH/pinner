package com.example.travelmaprecodebe.photo;

public interface PhotoProvider<Key, Photo extends PhotoHolder> {
    Key save(Photo photo);
    Photo load(Key key);
}
