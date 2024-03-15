package dev.pinner.service;

import dev.pinner.domain.dto.TravelDto;
import dev.pinner.domain.entity.Travel;
import dev.pinner.domain.entity.TravelShareInfo;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.exception.CustomException;
import dev.pinner.repository.TravelRepository;
import dev.pinner.repository.TravelShareRepository;
import dev.pinner.repository.TravelerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class TravelShareService {
    private final TravelRepository travelRepository;
    private final TravelerRepository travelerRepository;
    private final TravelShareRepository travelShareRepository;

    @Transactional
    public TravelShareInfo createTravelSharePublic(Traveler host, Long travelId, Optional<Duration> duration) {
        Travel travel = travelRepository.findTravelByTravelerIdAndTravelId(host.getId(), travelId);
        return travel.sharePublic(duration);
    }

    @Transactional
    public TravelShareInfo createTravelShareForMember(Traveler host, Long travelId, String guestEmail, Optional<Duration> duration) {

        Optional<Traveler> guestOrNull = travelerRepository.findByEmail(guestEmail);
        if (guestOrNull.isEmpty()) {
            throw new CustomException(
                HttpStatus.NOT_FOUND,
                "can not find guest"
            );
        }

        Traveler guest = guestOrNull.get();

        Travel travel = travelRepository.findTravelByTravelerIdAndTravelId(host.getId(), travelId);

        Optional<TravelShareInfo> alreadyShared = travel
                .getTravelShareInfos()
                .stream()
                .filter(info -> info.getGuest().getEmail().equals(guest.getEmail()))
                .findFirst();

        // 이미 초대된 멤버일 경우 기존 초대를 반환하고 조용히 넘어간다.
        if (alreadyShared.isPresent()) {
            return alreadyShared.get();
        }

        return travel.shareForMember(duration, guest);
    }

    @Transactional
    public List<Travel> getAllInvitedSharedTravel(Traveler guest) {
        return travelShareRepository
            .findAllInvitedTravelInfos(guest.getId())
            .stream().map(TravelShareInfo::getTravel)
            .toList();
    }

    @Transactional
    public TravelDto.Response getPublicSharedTravel(String shareCode) {
        Optional<TravelShareInfo> shareInfo = travelShareRepository.findByShareCode(shareCode);
        if (shareInfo.isEmpty()) {
            throw new CustomException(
                HttpStatus.NOT_FOUND,
                "can not find shared travel"
            );
        }

        if (shareInfo.get().isExpired()) {
            throw new CustomException(
                HttpStatus.NOT_FOUND,
                "expired share"
            );
        }

        return new TravelDto.Response(shareInfo.get().getTravel());
    }

    @Transactional
    public void deleteTravelShare(Traveler host, String travelShareCode) {
        Optional<TravelShareInfo> shareInfo = travelShareRepository.findByShareCode(travelShareCode);
        if (shareInfo.isEmpty()) {
            throw new CustomException(
                HttpStatus.NOT_FOUND,
                "failed to delete travel share: can not find travel share by id."
            );
        }

        Long travelOwnerId = shareInfo.get().getTravel().getTraveler().getId();
        Boolean isOwnerOfTravel = travelOwnerId.equals(host.getId());
        if (!isOwnerOfTravel) {
            throw new CustomException(
                HttpStatus.NOT_FOUND,
                "failed to delete travel share: does not have proper authority."
            );
        }

        travelShareRepository.deleteById(shareInfo.get().getId());
    }
}
