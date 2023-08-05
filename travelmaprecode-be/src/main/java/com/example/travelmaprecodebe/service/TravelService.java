package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.domain.dto.JourneyDto;
import com.example.travelmaprecodebe.domain.dto.TravelDto;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelService {

    private final TravelRepository travelRepository;
    private final JourneyRepository journeyRepository;
    private final TravelerRepository travelerRepository;
    private final PhotoRepository photoRepository;
    private final PhotoService photoService;

    public List<TravelDto.Response> getTravel(Traveler traveler) {
        travelRepository.flush();
        return travelRepository.findByTravelerIdOrderByOrderKeyAsc(traveler.getId())
                .stream()
                .map(TravelDto.Response::new)
                .collect(Collectors.toList());
    }

    private Traveler getTraveler(Long travelerId) {
        Optional<Traveler> traveler = travelerRepository.findById(travelerId);
        if (traveler.isEmpty()) {
            throw new RuntimeException("missing traveler");
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
    public List<TravelDto.Response> addJourney(Traveler traveler, Long travelId, JourneyDto.Request newJourney, List<MultipartFile> photos) throws IOException {
        Travel travel = travelRepository.findTravelByTravelerIdAndTravelId(traveler.getId(), travelId);

        Journey newJourneyEntity = newJourney.toEntity();
        newJourneyEntity.setTravel(travel);

        if (photos != null) {
            List<Photo> photoList = photoService.processPhotosForJourney(photos);
            for (Photo photo : photoList) {
                photo.setJourney(newJourneyEntity);
            }
        }

        return getTravel(traveler);
    }

    @Transactional
    public List<TravelDto.Response> deleteTravel(Traveler traveler, Long travelId) {
        travelRepository.deleteById(travelId);
        return getTravel(traveler);
    }

    @Transactional
    public List<TravelDto.Response> patchTravel(Traveler traveler, Long travelId, TravelDto.Request newTravel) {
        travelRepository.updateTravelTitleByTravelId(travelId, newTravel.getTitle());
        return getTravel(traveler);
    }

    @Transactional
    public List<TravelDto.Response> putOrderKey(Traveler traveler, List<TravelDto.Request> travelList) {
        for (TravelDto.Request newTravelRequestDto : travelList) {
            travelRepository.updateTravelOrderKeyByTravelerIdAndTravelId(traveler.getId(), newTravelRequestDto);
        }

        return getTravel(traveler);
    }

    @Transactional
    public List<TravelDto.Response> putJourney(Traveler traveler, Long travelId, Long journeyId, JourneyDto.Request newJourney, List<MultipartFile> photos) throws IOException {
        Optional<Journey> findJourney = journeyRepository.findById(journeyId);

        if (findJourney.isPresent()) {
            // 필요시 Journey, Travel 삭제 시에도 추가하기
            List<Photo> existingPhotos = findJourney.get().getPhotos();
            for (Photo existingPhoto : existingPhotos) {
                findJourney.get().removePhoto(existingPhoto);
            }

            List<Photo> photoList = photoService.processPhotosForJourney(photos);
            for (Photo photo : photoList) {
                photo.setJourney(findJourney.get());
            }
            findJourney.get().updateJourney(newJourney, photoList);
        }

        return getTravel(traveler);
    }

    @Transactional
    public List<TravelDto.Response> deleteJourney(Traveler traveler, Long travelId, Long journeyId) {
        Journey journey = travelRepository.findJourneyByTravelIdAndJourneyId(travelId, journeyId);
        if (journey != null) {
            Travel travel = journey.getTravel();
            if (travel != null) {
                travel.getJourneys().remove(journey);
            }
            journeyRepository.delete(journey);
        }

        return getTravel(traveler);
    }
}