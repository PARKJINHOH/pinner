package dev.pinner.repository;

import dev.pinner.domain.dto.TravelDto;
import dev.pinner.domain.entity.Travel;

import java.util.List;

public interface TravelRepositoryCustom {
    List<Travel> findByTravelerIdOrderByOrderKeyAsc(Long id);
    Travel findTravelByTravelerIdAndTravelId(Long travelerId, Long travelId);

    void updateTravelTitleByTravelId(Long travelId, String title);

    void updateTravelOrderKeyByTravelerIdAndTravelId(Long travelerId, TravelDto.Request newTravelRequestDto);
}
