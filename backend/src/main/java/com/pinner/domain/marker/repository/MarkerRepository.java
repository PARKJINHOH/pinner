package com.pinner.domain.marker.repository;

import com.pinner.domain.marker.entity.Marker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MarkerRepository extends JpaRepository<Marker, Long> {

    Optional<Marker> findByTripDay_IdAndDeletedAtIsNull(Long tripDayId);

    boolean existsByTripDay_IdAndDeletedAtIsNull(Long tripDayId);

    @Query("SELECT m FROM Marker m JOIN FETCH m.tripDay td " +
           "WHERE td.trip.id = :tripId AND m.deletedAt IS NULL " +
           "ORDER BY td.date ASC NULLS LAST, td.createdAt ASC")
    List<Marker> findByTripIdWithDayAndDeletedAtIsNull(@Param("tripId") Long tripId);

    @Modifying
    @Query("UPDATE Marker m SET m.deletedAt = :now WHERE m.tripDay.id IN :dayIds AND m.deletedAt IS NULL")
    void softDeleteByDayIds(@Param("dayIds") List<Long> dayIds, @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE Marker m SET m.deletedAt = :now WHERE m.tripDay.id = :dayId AND m.deletedAt IS NULL")
    void softDeleteByDayId(@Param("dayId") Long dayId, @Param("now") LocalDateTime now);
}
