package dev.pinner.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.Optional;

public class TravelShareDto {

    public static enum ShareType {
        PUBLIC,
        FOR_MEMBER
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request {

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
}
