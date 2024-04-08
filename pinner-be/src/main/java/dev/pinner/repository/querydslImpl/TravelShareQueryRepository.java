package dev.pinner.repository.querydslImpl;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import dev.pinner.domain.entity.TravelShareInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import static dev.pinner.domain.entity.QTravel.travel;
import static dev.pinner.domain.entity.QTravelShareInfo.travelShareInfo;

@Repository
@RequiredArgsConstructor
public class TravelShareQueryRepository {
    private final JPAQueryFactory queryFactory;

    public List<TravelShareInfo> findAllInvitedTravelInfos(Long guestId) {
        LocalDateTime now = LocalDateTime.now();

        return queryFactory.
                selectFrom(travelShareInfo)
                .join(travelShareInfo.travel, travel)
                .fetchJoin()
                .where(guestIdEq(guestId),
                        travelShareInfo.expiredAt.after(now)
                                .or(travelShareInfo.expiredAt.isNull())
                )
                .fetch();
    }

    private BooleanExpression guestIdEq(Long guestId) {
        return (guestId == null) ? null : travelShareInfo.guest.id.eq(guestId);
    }
}
