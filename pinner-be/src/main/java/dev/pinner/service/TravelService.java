package dev.pinner.service;

import dev.pinner.domain.dto.TravelDto;
import dev.pinner.domain.entity.Travel;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.exception.BusinessException;
import dev.pinner.repository.TravelRepository;
import dev.pinner.repository.TravelShareRepository;
import dev.pinner.repository.TravelerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelService {

    private final TravelRepository travelRepository;
    private final TravelerRepository travelerRepository;
    private final TravelShareRepository travelShareRepository;

    public List<TravelDto.Response> getTravel(Traveler traveler) {
        travelRepository.flush(); // 없을 경우 insert된 여정이 2번 들어감

        List<TravelDto.Response> travels = new ArrayList<>();

        // 내가 소유한 트레블 검색
        travels.addAll(travelRepository.findByTravelerIdOrderByOrderKeyAsc(traveler.getId())
            .stream()
            .map(TravelDto.Response::new)
            .toList());

        // 공유 받은 트레블 검색
        travels.addAll(travelShareRepository.findAllInvitedTravelInfos(traveler.getId())
            .stream()
            .map(TravelDto.Response::new)
            .toList());

        return travels;
    }

    private Traveler getTraveler(Long travelerId) {
        Optional<Traveler> traveler = travelerRepository.findById(travelerId);
        if (traveler.isEmpty()) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "사용자가 없습니다.");
        }
        return traveler.get();
    }

    @Transactional
    public List<TravelDto.Response> addTravel(Traveler traveler, TravelDto.Request newTravel) {
        Traveler findTraveler = getTraveler(traveler.getId());
        findTraveler.addTravel(newTravel.getTitle());
        return getTravel(traveler);
    }

    @Transactional
    public List<TravelDto.Response> deleteTravel(Traveler traveler, Long travelId) {
        travelRepository.deleteById(travelId);
        return getTravel(traveler);
    }

    @Transactional
    public List<TravelDto.Response> updateTravelTitle(Traveler traveler, Long travelId, TravelDto.Request newTravel) {
        travelRepository.updateTravelTitleByTravelId(travelId, newTravel.getTitle());
        return getTravel(traveler);
    }

    @Transactional
    public List<TravelDto.Response> updateTravelOrderKey(Traveler traveler, List<TravelDto.Request> travelList) {
        for (TravelDto.Request newTravelRequestDto : travelList) {
            travelRepository.updateTravelOrderKeyByTravelerIdAndTravelId(traveler.getId(), newTravelRequestDto);
        }

        return getTravel(traveler);
    }

}