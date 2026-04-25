package com.pinner.domain.marker.repository;

import com.pinner.domain.marker.entity.Marker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MarkerRepository extends JpaRepository<Marker, Long> {

    @Modifying
    @Query("UPDATE Marker m SET m.deletedAt = :now WHERE m.tripDay.id IN :dayIds AND m.deletedAt IS NULL")
    void softDeleteByDayIds(@Param("dayIds") List<Long> dayIds, @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE Marker m SET m.deletedAt = :now WHERE m.tripDay.id = :dayId AND m.deletedAt IS NULL")
    void softDeleteByDayId(@Param("dayId") Long dayId, @Param("now") LocalDateTime now);
}
