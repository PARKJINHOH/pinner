package dev.pinner.repository.impl;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import dev.pinner.domain.dto.TravelerDto;
import dev.pinner.repository.TravelerRepositoryCustom;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

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

        LocalDate now = LocalDate.now();
        LocalDateTime startOfDay = now.minusMonths(12).withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfDay = now.withDayOfMonth(now.lengthOfMonth()).atTime(LocalTime.MAX);

        List<Tuple> results = queryFactory
                .select(traveler.createdDate.yearMonth(), traveler.count())
                .from(traveler)
                .where(traveler.createdDate.between(startOfDay, endOfDay))
                .groupBy(traveler.createdDate.yearMonth())
                .fetch();

        // 12개월 기준으로 데이터가 없는 경우를 대비하여 초기화
        Map<String, Long> countByMonth = new TreeMap<>();
        for (int i = 0; i < 12; i++) {
            String monthKey = now.minusMonths(i).format(DateTimeFormatter.ofPattern("yy.MM"));
            countByMonth.put(monthKey, 0L);
        }

        // DB에서 조회한 년월 데이터 세팅
        for (Tuple result : results) {
            Integer monthYearInt = result.get(0, Integer.class);
            YearMonth monthYear = YearMonth.of(monthYearInt / 100, monthYearInt % 100); // 202101 -> 2021-01
            String month = monthYear.format(DateTimeFormatter.ofPattern("yy.MM"));
            Long count = result.get(1, Long.class);
            countByMonth.put(month, count);
        }

        return countByMonth.entrySet()
                .stream()
                .map(entry -> new TravelerDto.SummaryResponse(entry.getKey(), entry.getValue()))
                .toList();
    }
}
