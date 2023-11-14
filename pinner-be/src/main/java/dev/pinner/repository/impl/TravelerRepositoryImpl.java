package dev.pinner.repository.impl;

import dev.pinner.repository.TravelerRepositoryCustom;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.EntityManager;

import static dev.pinner.domain.entity.QTraveler.traveler;

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
        return updatedRows == 1;
    }

    @Override
    public boolean updateTravelerPasswordByTravelerEmail(String email, String password) {
        log.info("updateTravelerPasswordByTravelerEmail");

        long updatedRows = queryFactory
                .update(traveler)
                .set(traveler.password, password)
                .where(traveler.email.eq(email))
                .execute();
        return updatedRows == 1;
    }
}
