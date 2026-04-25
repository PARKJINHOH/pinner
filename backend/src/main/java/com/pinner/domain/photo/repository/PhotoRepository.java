package com.pinner.domain.photo.repository;

import com.pinner.domain.photo.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {

    @Modifying
    @Query("UPDATE Photo p SET p.deletedAt = :now WHERE p.tripDay.id IN :dayIds AND p.deletedAt IS NULL")
    void softDeleteByDayIds(@Param("dayIds") List<Long> dayIds, @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE Photo p SET p.deletedAt = :now WHERE p.tripDay.id = :dayId AND p.deletedAt IS NULL")
    void softDeleteByDayId(@Param("dayId") Long dayId, @Param("now") LocalDateTime now);
}
