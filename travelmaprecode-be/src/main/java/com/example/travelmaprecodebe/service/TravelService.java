package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.domain.dto.NewJourneyRequestDto;
import com.example.travelmaprecodebe.domain.dto.NewTravelRequestDto;
import com.example.travelmaprecodebe.domain.dto.NewTravelResponseDto;
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

    public NewTravelResponseDto postTravel(Traveler traveler, NewTravelRequestDto newTravel) {
        Traveler findTraveler = getTraveler(traveler.getId());
        Travel travel = findTraveler.addTravel(newTravel.getTitle());
        em.flush();
        em.clear();
        return new NewTravelResponseDto(travel);
    }

    @Transactional
    public List<NewTravelResponseDto> getTravel(Traveler traveler) {
        return travelRepository.findAllTravel(traveler.getId())
                .stream()
                .map(NewTravelResponseDto::new)
                .collect(Collectors.toList());
    }

    public Long postJourney(Traveler traveler, Long travelId, NewJourneyRequestDto newJourney) {
        Travel travel = travelRepository.findTravel(traveler.getId(), travelId);

        Journey newJourneyEntity = newJourney.toEntity();
        newJourneyEntity.addTravel(travel);
        Journey savedJourney = journeyRepository.save(newJourneyEntity);

        return savedJourney.getId();
    }

    public List<NewTravelResponseDto> deleteTravel(Traveler traveler, Long travelId) {
        travelRepository.deleteTravel(travelId);
        return getTravel(traveler);
    }

    public List<NewTravelResponseDto> patchTravel(Traveler traveler, Long travelId, NewTravelRequestDto newTravel) {
        travelRepository.patchTravel(traveler.getId(), travelId, newTravel.getTitle());
        return getTravel(traveler);
    }

    public List<NewTravelResponseDto> putOrderKey(Traveler traveler, List<NewTravelRequestDto> travelList) {
        for (NewTravelRequestDto newTravelRequestDto : travelList) {
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


    public List<NewTravelResponseDto> patchJourney(Traveler traveler, Long travelId, Long journeyId, NewJourneyRequestDto newJourney) {
        Journey journey = travelRepository.findJourney(travelId, journeyId);
        journey.updateJourney(newJourney);
        return getTravel(traveler);
    }

    public List<NewTravelResponseDto> deleteJourney(Traveler traveler, Long travelId, Long journeyId) {
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