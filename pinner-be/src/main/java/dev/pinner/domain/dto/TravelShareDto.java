package dev.pinner.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

public class TravelShareDto {

    public static enum ShareType {
        PUBLIC,
        FOR_MEMBER
    }

    /**
     * 새로운 공유 요청
     */
    @Data
    @Builder
    @AllArgsConstructor
    public static class CreateRequest {

        /* Should one of [ "PUBLIC", "MEMBER" ]
         * We should change to use enum validator
         */
        @NotNull
        private String shareType;

        @NotNull
        private Long travelId;

        private Optional<String> guestEmail;

        /* Valid duration, zero means will not be expired */
        @JsonProperty("duration")
        private Optional<Long> durationInSec;
    }

    /**
     * 특정 Travel의 공유 상태 응답
     */
    @Data
    @Builder
    @AllArgsConstructor
    public static class GetShareOfTravelResponse {
        @NotNull
        private List<GetShareOfTravelItem> guests;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class GetShareOfTravelItem {
        @NotNull
        private String guestEmail;

        @NotNull
        private String guestNickname;

        @NotNull
        private String shareCode;
    }
}
