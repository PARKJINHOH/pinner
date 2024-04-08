package dev.pinner.repository.querydslImpl;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import dev.pinner.domain.entity.Travel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static dev.pinner.domain.entity.QTravel.travel;
import static dev.pinner.domain.entity.QTraveler.traveler;

@Repository
@RequiredArgsConstructor
public class TravelQueryRepository {
    private final JPAQueryFactory queryFactory;

    public List<Travel> findAllTravel(Long travelerId) {
        return queryFactory
                .selectFrom(travel)
                .where(travelerIdEq(travelerId))
                .orderBy(travel.orderKey.asc())
                .fetch();
    }

    public Travel findTravel(Long travelerId, Long travelId) {
        return queryFactory
                .selectFrom(travel)
                .join(travel.traveler, traveler)
                .fetchJoin()
                .where(
                        travelerIdEq(travelerId),
                        travelIdEq(travelId)
                )
                .fetchOne();

    }

    private BooleanExpression travelerIdEq(Long travelerId) {
        return (travelerId == null) ? null : travel.traveler.id.eq(travelerId);
    }

    private BooleanExpression travelIdEq(Long travelId) {
        return (travelId == null) ? null : travel.id.eq(travelId);
    }

}
