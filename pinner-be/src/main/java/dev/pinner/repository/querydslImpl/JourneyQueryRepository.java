package dev.pinner.repository.querydslImpl;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import dev.pinner.domain.entity.Journey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import static dev.pinner.domain.entity.QJourney.journey;

@Repository
@RequiredArgsConstructor
public class JourneyQueryRepository {
    private final JPAQueryFactory queryFactory;

    public Journey findJourney(Long journeyId) {
        return queryFactory
                .selectFrom(journey)
                .where(
                        journeyIdEq(journeyId)
                )
                .fetchOne();
    }

    private BooleanExpression journeyIdEq(Long journeyId) {
        return (journeyId == null) ? null : journey.id.eq(journeyId);
    }

}
