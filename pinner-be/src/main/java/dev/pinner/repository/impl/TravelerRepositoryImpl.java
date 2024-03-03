package dev.pinner.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import dev.pinner.domain.dto.QTravelerDto_SummaryResponse;
import dev.pinner.domain.dto.TravelerDto;
import dev.pinner.repository.TravelerRepositoryCustom;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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

    @Override
    public List<TravelerDto.SummaryResponse> getTravelerGroupByYearMonth() {
        log.info("getTravelerGroupByYearMonth");
        // todo : 6개월 이내 가입자 수

        LocalDate now = LocalDate.now();
        LocalDate sixMonthsAgo = now.minusMonths(6);

        return queryFactory
                .select(
                        new QTravelerDto_SummaryResponse(
                                traveler.createdDate.yearMonth().as("name"),
                                traveler.count().as("traveler")
                        )
                )
                .from(traveler)
                .where(traveler.createdDate.between(sixMonthsAgo.atTime(LocalTime.MAX), now.atTime(LocalTime.MAX)))
                .groupBy(traveler.createdDate.yearMonth())
                .fetch();
    }
}
