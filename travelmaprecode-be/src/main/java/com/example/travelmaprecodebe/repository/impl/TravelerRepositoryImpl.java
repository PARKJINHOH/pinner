package com.example.travelmaprecodebe.repository.impl;

import com.example.travelmaprecodebe.repository.TravelerRepositoryCustom;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.EntityManager;

import static com.example.travelmaprecodebe.domain.entity.QTraveler.traveler;

@Slf4j
public class TravelerRepositoryImpl implements TravelerRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public TravelerRepositoryImpl(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    @Override
    public boolean updateTravelerStateByTravelerEmail(Long travelerId) {
        log.info("updateTravelerStateByTravelerEmail");

        long updatedRows = queryFactory
                .update(traveler)
                .set(traveler.state, false)
                .where(traveler.id.eq(travelerId))
                .execute();
        System.out.println("updatedRows = " + updatedRows);
        return updatedRows == 1;
    }
}
