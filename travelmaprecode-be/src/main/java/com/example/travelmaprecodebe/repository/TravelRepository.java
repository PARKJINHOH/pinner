package com.example.travelmaprecodebe.repository;

import com.example.travelmaprecodebe.domain.entity.QTravel;
import com.example.travelmaprecodebe.domain.entity.Travel;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TravelRepository {
    private final EntityManager em;

    public Travel findTravel(Long travelerId, Long travelId) {
        TypedQuery<Travel> query = em.createQuery("select t from Travel t join fetch t.traveler o where t.id = :travelId and o.id = :travelerId", Travel.class);
        query.setParameter("travelerId", travelerId);
        query.setParameter("travelId", travelId);

        return query.getSingleResult();
    }

    public List<Travel> findAllTravel(Long travelerId) {
        JPAQueryFactory queryFactory = new JPAQueryFactory(em);
        QTravel travel = QTravel.travel;

        return queryFactory
                .select(travel)
                .from(travel)
                .join(travel.journeys).fetchJoin()
                .where(travel.traveler.id.eq(travelerId))
                .fetch();
    }
}
