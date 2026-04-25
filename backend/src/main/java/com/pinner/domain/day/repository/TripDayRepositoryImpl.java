package com.pinner.domain.day.repository;

import com.pinner.domain.day.dto.DayResponse;
import com.pinner.domain.day.entity.QTripDay;
import com.pinner.domain.day.entity.TripDay;
import com.pinner.domain.marker.entity.QMarker;
import com.pinner.domain.photo.entity.QPhoto;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class TripDayRepositoryImpl implements TripDayRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<DayResponse> findDays(Long userId, Long tripId) {
        QTripDay day = QTripDay.tripDay;
        QPhoto photo = QPhoto.photo;
        QMarker marker = QMarker.marker;

        List<TripDay> days = queryFactory
                .selectFrom(day)
                .where(day.trip.id.eq(tripId)
                        .and(day.user.id.eq(userId))
                        .and(day.deletedAt.isNull()))
                .orderBy(day.date.asc().nullsLast(), day.createdAt.asc())
                .fetch();

        if (days.isEmpty()) return Collections.emptyList();

        List<Long> dayIds = days.stream().map(TripDay::getId).toList();

        Map<Long, Long> photoCounts = queryFactory
                .select(photo.tripDay.id, photo.count())
                .from(photo)
                .where(photo.tripDay.id.in(dayIds).and(photo.deletedAt.isNull()))
                .groupBy(photo.tripDay.id)
                .fetch()
                .stream()
                .collect(Collectors.toMap(
                        t -> t.get(photo.tripDay.id),
                        t -> t.get(photo.count())
                ));

        Set<Long> dayIdsWithMarker = queryFactory
                .select(marker.tripDay.id)
                .from(marker)
                .where(marker.tripDay.id.in(dayIds).and(marker.deletedAt.isNull()))
                .fetch()
                .stream()
                .collect(Collectors.toSet());

        return days.stream()
                .map(d -> DayResponse.from(d,
                        photoCounts.getOrDefault(d.getId(), 0L),
                        dayIdsWithMarker.contains(d.getId())))
                .toList();
    }
}
