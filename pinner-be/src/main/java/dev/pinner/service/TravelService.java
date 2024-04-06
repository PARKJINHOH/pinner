package dev.pinner.service;

import dev.pinner.domain.dto.TravelDto;
import dev.pinner.domain.entity.Travel;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.exception.BusinessException;
import dev.pinner.repository.TravelRepository;
import dev.pinner.repository.TravelerRepository;
import dev.pinner.repository.querydslImpl.TravelQueryRepository;
import dev.pinner.repository.querydslImpl.TravelShareQueryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelService {

    private final TravelRepository travelRepository;
    private final TravelQueryRepository travelQueryRepository;
    private final TravelerRepository travelerRepository;
    private final TravelShareQueryRepository travelShareQueryRepository;

    public List<TravelDto.Response> getTravel(Traveler traveler) {
        travelRepository.flush(); // 없을 경우 insert된 여정이 2번 들어감

        List<TravelDto.Response> travels = new ArrayList<>();

        // 내가 소유한 트레블 검색
        travels.addAll(travelQueryRepository.findAllTravel(traveler.getId())
            .stream()
            .map(TravelDto.Response::new)
            .toList());

        // 공유 받은 트레블 검색
        travels.addAll(travelShareQueryRepository.findAllInvitedTravelInfos(traveler.getId())
            .stream()
            .map(TravelDto.Response::new)
            .toList());

        return travels;
    }

    private Traveler getTraveler(Long travelerId) {
        Optional<Traveler> travelerOpt = travelerRepository.findById(travelerId);
        if (travelerOpt.isEmpty()) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "사용자가 없습니다.");
        }
        return travelerOpt.get();
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
        Optional<Travel> travelOpt = travelRepository.findById(travelId);
        if(travelOpt.isEmpty()) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "여행이 없습니다.");
        }

        Travel travel = travelOpt.get();
        travel.updateTitle(newTravel.getTitle());

        return getTravel(traveler);
    }

    @Transactional
    public List<TravelDto.Response> updateTravelOrderKey(Traveler traveler, List<TravelDto.Request> travelList) {

        Optional<Traveler> travelerOpt = travelerRepository.findById(traveler.getId());
        if(travelerOpt.isEmpty()) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "사용자가 없습니다.");
        }

        List<Travel> travels = travelerOpt.get().getTravels();
        for (Travel travel : travels) {
            for (TravelDto.Request request : travelList) {
                if (travel.getId().equals(request.getId())) {
                    travel.updateOrderKey(request.getOrderKey());
                    break;
                }
            }
        }

        return getTravel(traveler);
    }

}