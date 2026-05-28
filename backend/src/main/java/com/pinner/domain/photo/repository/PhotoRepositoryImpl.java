package com.pinner.domain.photo.repository;

import com.pinner.domain.photo.entity.Photo;
import com.pinner.domain.photo.entity.QPhoto;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.*;

@RequiredArgsConstructor
public class PhotoRepositoryImpl implements PhotoRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Photo> findSortedPhotos(Long userId, Long dayId) {
        QPhoto photo = QPhoto.photo;

        return queryFactory
                .selectFrom(photo)
                .where(photo.tripDay.id.eq(dayId)
                        .and(photo.user.id.eq(userId))
                        .and(photo.deletedAt.isNull()))
                .orderBy(
                        new CaseBuilder()
                                .when(photo.exifTakenAt.isNull()).then(1)
                                .otherwise(0).asc(),
                        photo.exifTakenAt.asc(),
                        photo.uploadedAt.asc()
                )
                .fetch();
    }

    @Override
    public Map<Long, String> findFirstPhotoUrlsByDayIds(List<Long> dayIds) {
        if (dayIds.isEmpty()) return Collections.emptyMap();

        QPhoto photo = QPhoto.photo;

        List<Photo> photos = queryFactory
                .selectFrom(photo)
                .where(photo.tripDay.id.in(dayIds).and(photo.deletedAt.isNull()))
                .orderBy(
                        new CaseBuilder()
                                .when(photo.exifTakenAt.isNull()).then(1)
                                .otherwise(0).asc(),
                        photo.exifTakenAt.asc(),
                        photo.uploadedAt.asc()
                )
                .fetch();

        // Keep first occurrence per dayId (list is already sorted)
        Map<Long, String> result = new LinkedHashMap<>();
        for (Photo p : photos) {
            Long dayId = p.getTripDay().getId();
            result.putIfAbsent(dayId, "/api/photos/" + p.getFileName());
        }
        return result;
    }
}
