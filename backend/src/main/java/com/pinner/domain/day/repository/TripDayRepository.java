package com.pinner.domain.day.repository;

import com.pinner.domain.day.entity.TripDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TripDayRepository extends JpaRepository<TripDay, Long>, TripDayRepositoryCustom {

    Optional<TripDay> findByIdAndUser_IdAndDeletedAtIsNull(Long id, Long userId);

    @Query("SELECT td.id FROM TripDay td WHERE td.trip.id = :tripId AND td.deletedAt IS NULL")
    List<Long> findIdsByTripId(@Param("tripId") Long tripId);
}
