package com.pinner.domain.trip.repository;

import com.pinner.domain.trip.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long>, TripRepositoryCustom {

    Optional<Trip> findByIdAndUser_IdAndDeletedAtIsNull(Long id, Long userId);

    @Query("SELECT t FROM Trip t WHERE t.id IN :ids AND t.user.id = :userId AND t.deletedAt IS NULL")
    List<Trip> findAllByIdsAndUserId(@Param("ids") Collection<Long> ids, @Param("userId") Long userId);

    @Query("SELECT COALESCE(MAX(t.sortOrder), 0) FROM Trip t WHERE t.user.id = :userId AND t.deletedAt IS NULL")
    int findMaxSortOrderByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE TripDay td SET td.deletedAt = :now WHERE td.trip.id = :tripId AND td.deletedAt IS NULL")
    void softDeleteDaysByTripId(@Param("tripId") Long tripId, @Param("now") LocalDateTime now);
}
