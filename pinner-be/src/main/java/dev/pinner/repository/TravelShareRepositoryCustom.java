package dev.pinner.repository;

import dev.pinner.domain.entity.TravelShareInfo;

import java.util.List;

public interface TravelShareRepositoryCustom {
    List<TravelShareInfo> findAllInvitedTravelInfos(Long guestId);
}
