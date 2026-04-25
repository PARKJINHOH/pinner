package com.pinner.domain.photo.repository;

import com.pinner.domain.photo.entity.Photo;

import java.util.List;
import java.util.Map;

public interface PhotoRepositoryCustom {

    List<Photo> findSortedPhotos(Long userId, Long dayId);

    Map<Long, String> findFirstPhotoUrlsByDayIds(List<Long> dayIds);
}
