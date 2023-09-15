package com.example.travelmaprecodebe.repository;

import com.example.travelmaprecodebe.domain.entity.Journey;

public interface JourneyRepositoryCustom  {

    Journey findJourneyByJourneyId(Long journeyId);

}
