package dev.pinner.service;

import dev.pinner.domain.dto.JourneyDto;
import dev.pinner.domain.dto.TravelDto;
import dev.pinner.domain.entity.Journey;
import dev.pinner.domain.entity.Photo;
import dev.pinner.domain.entity.Travel;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.repository.JourneyRepository;
import dev.pinner.repository.TravelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class JourneyService {

    private final TravelRepository travelRepository;
    private final JourneyRepository journeyRepository;
    private final PhotoService photoService;
    private final TravelService travelService;

    @Transactional
    public List<TravelDto.Response> addJourney(Traveler traveler, JourneyDto.Request newJourney, List<MultipartFile> photos) throws IOException {
        Travel travel = travelRepository.findTravelByTravelerIdAndTravelId(traveler.getId(), newJourney.getTravelId());

        Journey newJourneyEntity = newJourney.toEntity();
        newJourneyEntity.setTravel(travel);

        if (photos != null) {
            List<Photo> photoList = photoService.processPhotosForJourney(photos);
            for (Photo photo : photoList) {
                photo.setJourney(newJourneyEntity);
            }
        }

        return travelService.getTravel(traveler);
    }

    @Transactional
    public List<TravelDto.Response> deleteJourney(Traveler traveler, Long journeyId) {
        Journey journey = journeyRepository.findJourneyByJourneyId(journeyId);
        if (journey != null) {
            Travel travel = journey.getTravel();
            if (travel != null) {
                travel.getJourneys().remove(journey);
            }
            journeyRepository.delete(journey);
        }

        return travelService.getTravel(traveler);
    }

    @Transactional
    public List<TravelDto.Response> putJourney(Traveler traveler, Long journeyId, JourneyDto.Request newJourney, List<MultipartFile> photos) throws IOException {
        Optional<Journey> findJourney = journeyRepository.findById(journeyId);

        if (findJourney.isPresent()) {
            // 필요시 Journey, Travel 삭제 시에도 추가하기
            List<Photo> existingPhotos = findJourney.get().getPhotos();
            for (Photo existingPhoto : existingPhotos) {
                findJourney.get().removePhoto(existingPhoto);
            }

            List<Photo> photoList = photoService.processPhotosForJourney(photos);
            if (photoList != null) {
                for (Photo photo : photoList) {
                    photo.setJourney(findJourney.get());
                }
            }
            findJourney.get().updateJourney(newJourney, photoList);
        }

        return travelService.getTravel(traveler);
    }
}
