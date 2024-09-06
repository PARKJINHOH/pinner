package dev.pinner.scheduler;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.repository.TravelerRepository;
import dev.pinner.repository.querydslImpl.TravelerQueryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class Scheduler {
    private final TravelerRepository travelerRepository;
    private final TravelerQueryRepository travelerQueryRepository;

    @Scheduled(cron = "0 0 1 * * ?") //every day at 1am
    @Transactional(rollbackFor = Exception.class)
    public void deleteLockedTravelersOlderThan() {
        LocalDateTime date = LocalDate.now().minusDays(180).atStartOfDay();
        List<Traveler> travelers = travelerQueryRepository.deleteLockedTravelersOlderThan(date);
        if (!travelers.isEmpty()) {
            travelerRepository.deleteAll(travelers);
        }
    }


}
