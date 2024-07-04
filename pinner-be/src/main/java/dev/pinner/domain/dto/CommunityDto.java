package dev.pinner.domain.dto;

import dev.pinner.domain.entity.Community;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

public class CommunityDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request {
        private Long communityId;
        private String title;
        private String content;

        public Community toEntity() {
            return Community.builder()
                    .title(title)
                    .content(content)
                    .build();
        }
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private String travelerNickname;
        private int viewCount;
        private String status;

        public Response(Community community) {
            id = community.getId();
            title = community.getTitle();
            content = community.getContent();
            travelerNickname = community.getTraveler().getNickname();
            viewCount = community.getViewCount();
        }
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class CommunitySummaryResponse {
        private Long id;
        private String title;
        private String travelerNickname;

        public CommunitySummaryResponse(Community community) {
            id = community.getId();
            title = community.getTitle();
            travelerNickname = community.getTraveler().getNickname();
        }
    }
}
