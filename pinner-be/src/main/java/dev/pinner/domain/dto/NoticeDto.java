package dev.pinner.domain.dto;

import dev.pinner.domain.entity.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

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

        int pageNo; // 페이지번호

        public Response(Notice notice) {
            id = notice.getId();
            title = notice.getTitle();
            content = notice.getContent();
            writer = notice.getWriter();
            viewCount = notice.getViewCount();
            status = notice.getStatus();
        }
    }
}
