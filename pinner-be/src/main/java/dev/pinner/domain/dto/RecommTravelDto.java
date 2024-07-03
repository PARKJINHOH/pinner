package dev.pinner.domain.dto;

import dev.pinner.domain.entity.RecommTravel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

public class RecommTravelDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request {
        private Long RecommTravelId;
        private String title;
        private String content;
        private String writer;

        public RecommTravel toEntity() {
            return RecommTravel.builder()
                    .title(title)
                    .content(content)
                    .writer(writer)
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
        private String writer;
        private int viewCount;
        private String status;

        public Response(RecommTravel recommTravel) {
            id = recommTravel.getId();
            title = recommTravel.getTitle();
            content = recommTravel.getContent();
            writer = recommTravel.getWriter();
            viewCount = recommTravel.getViewCount();
        }
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class CommunitySummaryResponse {
        private Long id;
        private String title;
        private String writer;

        public CommunitySummaryResponse(RecommTravel recommTravel) {
            id = recommTravel.getId();
            title = recommTravel.getTitle();
            writer = recommTravel.getWriter();
        }
    }
}
