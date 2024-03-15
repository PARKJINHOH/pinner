package dev.pinner.domain.dto;

import dev.pinner.domain.entity.Travel;
import dev.pinner.domain.entity.TravelShareInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class TravelDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request{
        Long id;
        String title;
        Integer orderKey;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response{
        private Long id;
        private int orderKey;
        private String title;
        private List<JourneyDto.Response> journeys;
        private TravelSharedInfoDto.Response sharedInfo;

        public Response(Travel travel) {
            id = travel.getId();
            orderKey = travel.getOrderKey();
            title = travel.getTitle();
            journeys = travel.getJourneys().stream()
                    .map(JourneyDto.Response::new)
                    .sorted(Comparator.comparing(JourneyDto.Response::getDate).thenComparing(JourneyDto.Response::getOrderKey))
                    .collect(Collectors.toList());
        }


        /**
         * 공유 받은 Travel을 전송할 때 사용
         * @param shareInfo
         */
        public Response(TravelShareInfo shareInfo) {
            id = shareInfo.getTravel().getId();
            orderKey = shareInfo.getTravel().getOrderKey();
            title = shareInfo.getTravel().getTitle();
            journeys = shareInfo.getTravel().getJourneys().stream()
                .map(JourneyDto.Response::new)
                .sorted(Comparator.comparing(JourneyDto.Response::getDate).thenComparing(JourneyDto.Response::getOrderKey))
                .collect(Collectors.toList());
            sharedInfo = new TravelSharedInfoDto.Response(shareInfo);
        }
    }
}
