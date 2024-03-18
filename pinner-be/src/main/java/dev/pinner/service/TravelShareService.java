package dev.pinner.service;

import dev.pinner.domain.dto.TravelDto;
import dev.pinner.domain.dto.TravelShareDto;
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

    /**
     * 여행 공유(공개)
     *
     * @param host
     * @param travelId
     * @param duration
     * @return
     */
    @Transactional
    public TravelShareInfo createTravelSharePublic(Traveler host, Long travelId, Optional<Duration> duration) {
        Travel travel = travelRepository.findTravelByTravelerIdAndTravelId(host.getId(), travelId);
        return travel.sharePublic(duration);
    }

    /**
     * 여행 공유(특정 맴머)
     *
     * @param host
     * @param travelId
     * @param guestEmail
     * @param duration
     * @return
     */
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

    /**
     * 특정 여행의 모든 공유 조회
     *
     * @param travelId
     */
    @Transactional
    public TravelShareDto.GetShareOfTravelResponse getAllShareOfTravel(Traveler traveler,
                                                                       Long travelId) {
        Travel travel = travelRepository.findTravelByTravelerIdAndTravelId(traveler.getId(), travelId);
        if (travel == null) {
            throw new CustomException(
                HttpStatus.NOT_FOUND,
                "failed to retrieve shares of travel: can not find travel"
            );
        }

        List<TravelShareInfo> infos = travel.getTravelShareInfos();

        List<TravelShareDto.GetShareOfTravelItem> items = infos
            .stream().map(
                info -> new TravelShareDto.GetShareOfTravelItem(
                    info.getGuest().getEmail(),
                    info.getGuest().getNickname(),
                    info.getShareCode()
                )
            )
            .toList();

        return new TravelShareDto.GetShareOfTravelResponse(items);
    }

    /**
     * 자신이 공유 받은 모든 여행 조회
     *
     * @param guest
     * @return
     */
    @Transactional
    public List<Travel> getAllInvitedSharedTravel(Traveler guest) {
        return travelShareRepository
            .findAllInvitedTravelInfos(guest.getId())
            .stream().map(TravelShareInfo::getTravel)
            .toList();
    }

    /**
     * 공유 코드로 여행 조회
     *
     * @param shareCode
     * @return
     */
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

    /**
     * 공유 코드로 자신의 여행 공유 취소
     *
     * @param host
     * @param travelShareCode
     */
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
