package com.example.travelmaprecodebe.repository;

import com.example.travelmaprecodebe.domain.dto.TravelDto;
import com.example.travelmaprecodebe.domain.entity.Journey;
import com.example.travelmaprecodebe.domain.entity.Travel;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

import static com.example.travelmaprecodebe.domain.entity.QJourney.journey;
import static com.example.travelmaprecodebe.domain.entity.QTravel.travel;
import static com.example.travelmaprecodebe.domain.entity.QTraveler.traveler;

@Repository
@Slf4j
public class TravelRepository {
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public TravelRepository(EntityManager em) {
        this.em = em;
        queryFactory = new JPAQueryFactory(em);
    }

    public Travel findTravel(Long travelerId, Long travelId) {
        /*selectFrom */
        log.info("TravelRepository : findTravel");
        return queryFactory
                .selectFrom(travel)
                .join(travel.traveler, traveler).fetchJoin()
                .where(travel.traveler.id.eq(travelerId)
                        .and(travel.id.eq(travelId)))
                .fetchOne();

    }

    public Journey findJourney(Long travelId, Long journeyId) {
        /*selectFrom */
        log.info("TravelRepository : findJourney");
        return queryFactory
                .selectFrom(journey)
                .where(travel.id.eq(travelId)
                        .and(journey.id.eq(journeyId)))
                .fetchOne();
    }

    public List<Travel> findAllTravel(Long travelerId) {
        log.info("TravelRepository : findAllTravel");
        em.flush();
        em.clear();
        return queryFactory
                .selectFrom(travel)
                .where(travel.traveler.id.eq(travelerId))
                .orderBy(travel.orderKey.asc())
                .fetch();
    }

    public void deleteTravel(Long travelId) {
        log.info("TravelRepository : deleteTravel");

        Travel findTravel = em.find(Travel.class, travelId);
        if (findTravel != null) {
            em.remove(findTravel);
        }
    }

    public Long patchTravel(Long travelerId, Long travelId, String title) {
        log.info("TravelRepository : patchTravel");
        Long resultL = queryFactory
                .update(travel)
                .set(travel.title, title)
                .where(travel.traveler.id.eq(travelerId), travel.id.eq(travelId))
                .execute();

        em.flush();
        em.clear();
        return resultL;
    }

    public Long putOrderKey(Long travelerId, TravelDto.Request newTravelRequestDto) {
        log.info("TravelRepository : putOrderKey");
        Long resultL = queryFactory
                .update(travel)
                .set(travel.orderKey, newTravelRequestDto.getOrderKey())
                .where(travel.traveler.id.eq(travelerId), travel.id.eq(newTravelRequestDto.getId()))
                .execute();

        em.flush();
        em.clear();
        return resultL;
    }

}
