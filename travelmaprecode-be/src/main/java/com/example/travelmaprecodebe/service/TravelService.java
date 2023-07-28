package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.domain.dto.JourneyDto;
import com.example.travelmaprecodebe.domain.dto.TravelDto;
import com.example.travelmaprecodebe.domain.entity.Journey;
import com.example.travelmaprecodebe.domain.entity.Travel;
import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.repository.JourneyRepository;
import com.example.travelmaprecodebe.repository.PhotoRepository;
import com.example.travelmaprecodebe.repository.TravelRepository;
import com.example.travelmaprecodebe.repository.TravelerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TravelService {

    private final TravelRepository travelRepository;
    private final JourneyRepository journeyRepository;
    private final TravelerRepository travelerRepository;
    private final PhotoRepository photoRepository;
    private final EntityManager em;

    public TravelDto.Response postTravel(Traveler traveler, TravelDto.Request newTravel) {
        Traveler findTraveler = getTraveler(traveler.getId());
        Travel travel = findTraveler.addTravel(newTravel.getTitle());
        em.flush();
        em.clear();
        return new TravelDto.Response(travel);
    }

    @Transactional
    public List<TravelDto.Response> getTravel(Traveler traveler) {
        return travelRepository.findAllTravel(traveler.getId())
                .stream()
                .map(TravelDto.Response::new)
                .collect(Collectors.toList());
    }

    public Long postJourney(Traveler traveler, Long travelId, JourneyDto.Request newJourney) {
        Travel travel = travelRepository.findTravel(traveler.getId(), travelId);

        Journey newJourneyEntity = newJourney.toEntity();
        newJourneyEntity.addTravel(travel);
        Journey savedJourney = journeyRepository.save(newJourneyEntity);

        return savedJourney.getId();
    }

    public List<TravelDto.Response> deleteTravel(Traveler traveler, Long travelId) {
        travelRepository.deleteTravel(travelId);
        return getTravel(traveler);
    }

    public List<TravelDto.Response> patchTravel(Traveler traveler, Long travelId, TravelDto.Request newTravel) {
        travelRepository.patchTravel(traveler.getId(), travelId, newTravel.getTitle());
        return getTravel(traveler);
    }

    public List<TravelDto.Response> putOrderKey(Traveler traveler, List<TravelDto.Request> travelList) {
        for (TravelDto.Request newTravelRequestDto : travelList) {
            travelRepository.putOrderKey(traveler.getId(), newTravelRequestDto);
        }

        return getTravel(traveler);
    }

    private Traveler getTraveler(Long travelerId) {
        Optional<Traveler> traveler = travelerRepository.findById(travelerId);
        if (traveler.isEmpty()) {
            throw new RuntimeException("missing traveler");
        }
        return traveler.get();
    }


    public List<TravelDto.Response> patchJourney(Traveler traveler, Long travelId, Long journeyId, JourneyDto.Request newJourney) {
        Journey journey = travelRepository.findJourney(travelId, journeyId);
        journey.updateJourney(newJourney);
        return getTravel(traveler);
    }

    public List<TravelDto.Response> deleteJourney(Traveler traveler, Long travelId, Long journeyId) {
        Journey journey = travelRepository.findJourney(travelId, journeyId);
        if (journey == null) {
            // Todo
            return null;
        }

        Travel travel = journey.getTravel();
        if (travel != null) {
            travel.getJourneys().remove(journey);
        }
        journeyRepository.delete(journey);

        return getTravel(traveler);
    }
}