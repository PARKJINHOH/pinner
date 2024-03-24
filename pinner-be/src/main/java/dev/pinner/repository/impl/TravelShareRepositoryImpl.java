package dev.pinner.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import dev.pinner.domain.entity.TravelShareInfo;
import dev.pinner.repository.TravelShareRepositoryCustom;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;

import static dev.pinner.domain.entity.QTravel.travel;
import static dev.pinner.domain.entity.QTravelShareInfo.travelShareInfo;

@Slf4j
public class TravelShareRepositoryImpl implements TravelShareRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public TravelShareRepositoryImpl(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    @Override
    public List<TravelShareInfo> findAllInvitedTravelInfos(Long guestId) {
        LocalDateTime now = LocalDateTime.now();

        return queryFactory.selectFrom(travelShareInfo)
            .join(travelShareInfo.travel, travel).fetchJoin()
            .where(travelShareInfo.guest.id.eq(guestId)
                .and(
                    travelShareInfo.expiredAt.after(now)
                        .or(travelShareInfo.expiredAt.isNull())
                ))
            .fetch();
    }
}
