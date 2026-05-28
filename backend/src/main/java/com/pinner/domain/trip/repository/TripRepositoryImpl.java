package com.pinner.domain.trip.repository;

import com.pinner.domain.day.entity.QTripDay;
import com.pinner.domain.trip.dto.TripResponse;
import com.pinner.domain.trip.entity.QTrip;
import com.pinner.domain.trip.entity.Trip;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class TripRepositoryImpl implements TripRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<TripResponse> findMyTrips(Long userId) {
        QTrip trip = QTrip.trip;
        QTripDay tripDay = QTripDay.tripDay;

        List<Trip> trips = queryFactory
                .selectFrom(trip)
                .where(trip.user.id.eq(userId).and(trip.deletedAt.isNull()))
                .orderBy(trip.sortOrder.asc())
                .fetch();

        if (trips.isEmpty()) return Collections.emptyList();

        List<Long> tripIds = trips.stream().map(Trip::getId).toList();

        Map<Long, Long> dayCounts = queryFactory
                .select(tripDay.trip.id, tripDay.count())
                .from(tripDay)
                .where(tripDay.trip.id.in(tripIds).and(tripDay.deletedAt.isNull()))
                .groupBy(tripDay.trip.id)
                .fetch()
                .stream()
                .collect(Collectors.toMap(
                        t -> t.get(tripDay.trip.id),
                        t -> t.get(tripDay.count())
                ));

        return trips.stream()
                .map(t -> TripResponse.from(t, dayCounts.getOrDefault(t.getId(), 0L)))
                .toList();
    }
}
