package dev.pinner.repository.impl;

import dev.pinner.domain.dto.TravelDto;
import dev.pinner.domain.entity.Travel;
import dev.pinner.repository.TravelRepositoryCustom;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.EntityManager;
import java.util.List;

import static dev.pinner.domain.entity.QTravel.travel;
import static dev.pinner.domain.entity.QTraveler.traveler;

@Slf4j
public class TravelRepositoryImpl implements TravelRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public TravelRepositoryImpl(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    @Override
    public List<Travel> findByTravelerIdOrderByOrderKeyAsc(Long travelerId) {
        log.info("findByTravelerIdOrderByOrderKeyAsc");
        return queryFactory
                .selectFrom(travel)
                .where(travel.traveler.id.eq(travelerId))
                .orderBy(travel.orderKey.asc())
                .fetch();
    }

    @Override
    public Travel findTravelByTravelerIdAndTravelId(Long travelerId, Long travelId) {
        log.info("findTravelByTravelerIdAndTravelId");
        return queryFactory
                .selectFrom(travel)
                .join(travel.traveler, traveler).fetchJoin()
                .where(travel.traveler.id.eq(travelerId)
                        .and(travel.id.eq(travelId)))
                .fetchOne();

    }

    @Override
    public void updateTravelTitleByTravelId(Long travelId, String title) {
        log.info("updateTravelTitleByTravelId");
        queryFactory
                .update(travel)
                .set(travel.title, title)
                .where(travel.id.eq(travelId))
                .execute();
    }

    @Override
    public void updateTravelOrderKeyByTravelerIdAndTravelId(Long travelerId, TravelDto.Request newTravelRequestDto) {
        log.info("updateTravelOrderKeyByTravelerIdAndTravelId");
        queryFactory
                .update(travel)
                .set(travel.orderKey, newTravelRequestDto.getOrderKey())
                .where(travel.traveler.id.eq(travelerId), travel.id.eq(newTravelRequestDto.getId()))
                .execute();
    }

}