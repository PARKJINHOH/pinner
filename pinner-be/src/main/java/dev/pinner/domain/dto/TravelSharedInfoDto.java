package dev.pinner.domain.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import dev.pinner.domain.entity.TravelShareInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

public class TravelSharedInfoDto {
    @Data
    @Builder
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Response {
        private Long id;
        private LocalDateTime expiredAt;
        private Long hostId;
        private String hostNickname;

        public Response(TravelShareInfo info) {
            id = info.getId();
            expiredAt = info.getExpiredAt();
            hostId = info.getTravel().getTraveler().getId();
            hostNickname = info.getTravel().getTraveler().getNickname();
        }
    }
}
