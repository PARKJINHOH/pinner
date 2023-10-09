package dev.pinner.repository;

import dev.pinner.domain.entity.Journey;

public interface JourneyRepositoryCustom  {

    Journey findJourneyByJourneyId(Long journeyId);

}
