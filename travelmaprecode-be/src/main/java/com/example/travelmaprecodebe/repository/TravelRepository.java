package com.example.travelmaprecodebe.repository;

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

    public List<Travel> findAllTravel(Long travelerId) {
        log.info("TravelRepository : findAllTravel");
        em.flush();
        em.clear();
        return queryFactory
                .selectFrom(travel)
                .where(travel.traveler.id.eq(travelerId))
                .fetch();
    }

    public Long deleteTravel(Long travelerId, Long travelId){
        log.info("TravelRepository : deleteTravel");
        queryFactory
                .delete(journey)
                .where(journey.travel.id.eq(travelId))
                .execute();

        return queryFactory
                .delete(travel)
                .where(travel.id.eq(travelId),
                        travel.traveler.id.eq(travelerId))
                .execute();
    }
}
