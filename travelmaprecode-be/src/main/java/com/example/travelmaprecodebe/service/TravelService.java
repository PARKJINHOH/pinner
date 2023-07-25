package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.domain.dto.NewJourneyRequestDto;
import com.example.travelmaprecodebe.domain.dto.NewTravelRequestDto;
import com.example.travelmaprecodebe.domain.dto.NewTravelResponseDto;
import com.example.travelmaprecodebe.domain.entity.Journey;
import com.example.travelmaprecodebe.domain.entity.Photo;
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

    public NewTravelResponseDto postTravel(Long travelerId, NewTravelRequestDto newTravel) {
        Traveler traveler = getTraveler(travelerId);
        Travel travel = traveler.addTravel(newTravel.getTitle());
        em.flush();
        em.clear();
        return new NewTravelResponseDto(travel);
    }

    public List<NewTravelResponseDto> getTravel(Long travelerId) {
        return travelRepository.findAllTravel(travelerId)
                .stream()
                .map(NewTravelResponseDto::new)
                .collect(Collectors.toList());
    }

    public Long postJourney(Long travelerId, Long travelId, NewJourneyRequestDto newJourney) {
        Travel travel = travelRepository.findTravel(travelerId, travelId);

        Journey newJourneyEntity = newJourney.toEntity();
        newJourneyEntity.addTravel(travel);
        Journey savedJourney = journeyRepository.save(newJourneyEntity);

        return savedJourney.getId();
    }

    public List<NewTravelResponseDto> deleteTravel(Long travelerId, Long travelId) {
        travelRepository.deleteTravel(travelId);
        return getTravel(travelerId);
    }

    public List<NewTravelResponseDto> patchTravel(Long travelerId, Long travelId, NewTravelRequestDto newTravel) {
        travelRepository.patchTravel(travelerId, travelId, newTravel.getTitle());
        return getTravel(travelerId);
    }

    public List<NewTravelResponseDto> putOrderKey(Long travelerId, List<NewTravelRequestDto> travelList) {
        for (NewTravelRequestDto newTravelRequestDto : travelList) {
            travelRepository.putOrderKey(travelerId, newTravelRequestDto);
        }

        return getTravel(travelerId);
    }

    private Traveler getTraveler(Long travelerId) {
        Optional<Traveler> traveler = travelerRepository.findById(travelerId);
        if (traveler.isEmpty()) {
            throw new RuntimeException("missing traveler");
        }
        return traveler.get();
    }


    public List<NewTravelResponseDto> patchJourney(Long travelId, Long journeyId, NewJourneyRequestDto newJourney) {
        Journey journey = travelRepository.findJourney(travelId, journeyId);
        journey.updateJourney(newJourney);
        return getTravel(travelId);
    }

    public List<NewTravelResponseDto> deleteJourney(Long id, Long travelId, Long journeyId) {
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

        return getTravel(travelId);
    }
}