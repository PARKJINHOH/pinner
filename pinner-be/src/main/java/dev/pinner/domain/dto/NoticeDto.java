package dev.pinner.domain.dto;

import dev.pinner.domain.entity.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

public class NoticeDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Request {
        private Long NoticeId;
        private String title;
        private String content;
        private String writer;

        public Notice toEntity() {
            return Notice.builder()
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

        public Response(Notice notice) {
            id = notice.getId();
            title = notice.getTitle();
            content = notice.getContent();
            writer = notice.getWriter();
            viewCount = notice.getViewCount();
            status = notice.getStatus();
        }
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class NoticeDataListResponse {
        private List<Response> noticeList;

        int pageNo; // 페이지번호
        int pageSize; // 페이지 사이즈
        int totalPageCnt; // 총 페이지 수
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class CommunitySummaryResponse {
        private Long id;
        private String title;
        private String writer;

        public CommunitySummaryResponse(Notice notice) {
            id = notice.getId();
            title = notice.getTitle();
            writer = notice.getWriter();
        }
    }
}
