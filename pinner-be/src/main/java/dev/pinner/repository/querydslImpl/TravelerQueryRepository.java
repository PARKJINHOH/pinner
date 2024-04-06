package dev.pinner.repository.querydslImpl;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import dev.pinner.domain.dto.TravelerDto;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import static dev.pinner.domain.entity.QTraveler.traveler;

@Repository
public class TravelerQueryRepository {
    private final JPAQueryFactory queryFactory;

    public TravelerQueryRepository(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    // 년월 회원추이 조회
    public List<TravelerDto.SummaryResponse> getTravelerGroupByYearMonth() {

        LocalDate now = LocalDate.now();
        LocalDateTime startOfDay = now.minusMonths(12).withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfDay = now.withDayOfMonth(now.lengthOfMonth()).atTime(LocalTime.MAX);

        List<Tuple> results = queryFactory
                .select(
                        traveler.createdDate.yearMonth(), traveler.count()
                )
                .from(traveler)
                .where(createdDateBetween(startOfDay, endOfDay))
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
            YearMonth monthYear = YearMonth.of(monthYearInt / 100, monthYearInt % 100);
            String month = monthYear.format(DateTimeFormatter.ofPattern("yy.MM"));
            countByMonth.put(month, result.get(1, Long.class));
        }

        // 누적 회원수 계산
        Long cumulativeCount = 0L;
        for (Map.Entry<String, Long> entry : countByMonth.entrySet()) {
            cumulativeCount += entry.getValue();
            entry.setValue(cumulativeCount);
        }

        return countByMonth.entrySet().stream()
                .map(entry -> new TravelerDto.SummaryResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    private BooleanExpression createdDateGoe(LocalDateTime createdDate) {
        return createdDate != null ? traveler.createdDate.goe(createdDate) : null; // goe >=
    }

    private BooleanExpression createdDateLoe(LocalDateTime createdDate) {
        return createdDate != null ? traveler.createdDate.loe(createdDate) : null; // loe <=
    }

    private BooleanExpression createdDateBetween(LocalDateTime createdDateLoe, LocalDateTime createdDateGoe) {
        return createdDateGoe(createdDateLoe).and(createdDateLoe(createdDateGoe));
    }


}
