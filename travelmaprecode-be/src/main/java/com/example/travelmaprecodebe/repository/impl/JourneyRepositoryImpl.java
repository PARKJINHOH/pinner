package com.example.travelmaprecodebe.repository.impl;

import com.example.travelmaprecodebe.domain.entity.Journey;
import com.example.travelmaprecodebe.repository.JourneyRepositoryCustom;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.EntityManager;

import static com.example.travelmaprecodebe.domain.entity.QJourney.journey;

@Slf4j
public class JourneyRepositoryImpl implements JourneyRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public JourneyRepositoryImpl(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    @Override
    public Journey findJourneyByJourneyId(Long journeyId) {
        log.info("findJourneyByTravelIdAndJourneyId");
        return queryFactory
                .selectFrom(journey)
                .where(journey.id.eq(journeyId))
                .fetchOne();
    }

}
