package dev.pinner.repository;


import dev.pinner.domain.dto.TravelerDto;

import java.util.List;

public interface TravelerRepositoryCustom {
    boolean updateTravelerStateByTravelerEmail(Long travelerId);
    boolean updateTravelerPasswordByTravelerEmail(String email, String password);

    List<TravelerDto.SummaryResponse> getTravelerGroupByYearMonth();
}
