package dev.pinner.repository.impl;

import dev.pinner.domain.entity.Journey;
import dev.pinner.repository.JourneyRepositoryCustom;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.EntityManager;

import static dev.pinner.domain.entity.QJourney.journey;

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
