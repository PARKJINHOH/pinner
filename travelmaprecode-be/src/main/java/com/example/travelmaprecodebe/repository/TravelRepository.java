package com.example.travelmaprecodebe.repository;

import com.example.travelmaprecodebe.domain.entity.Travel;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

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

//    public Travel findTravel(Long travelerId, Long travelId) {
//        TypedQuery<Travel> query = em.createQuery("select t from Travel t join fetch t.traveler o where t.id = :travelId and o.id = :travelerId", Travel.class);
//        query.setParameter("travelerId", travelerId);
//        query.setParameter("travelId", travelId);
//
//        return query.getSingleResult();
//    }

    public Travel findTravel(Long travelerId, String travelEmail) {
        log.info("TravelRepository : {}", "findTravel");
        return queryFactory
                .selectFrom(travel)
                .join(travel.traveler, traveler).fetchJoin()
                .where(travel.traveler.id.eq(travelerId)
                        .and(traveler.email.eq(travelEmail)))
                .fetchOne();

    }

    public List<Travel> findAllTravel(Long travelerId) {
        log.info("TravelRepository : {}", "findAllTravel");
        return queryFactory
                .select(travel)
                .from(travel)
                .leftJoin(travel.journeys).fetchJoin()
                .where(travel.traveler.id.eq(travelerId))
                .fetch();
    }
}
