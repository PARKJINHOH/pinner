package dev.pinner.controller.admin;

import dev.pinner.domain.dto.NoticeDto;
import dev.pinner.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/notice")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    /**
     * 공지사항 리스트 조회
     */
    @GetMapping()
    public ResponseEntity<?> getNoticeList(@RequestParam(required = false, defaultValue = "0", value = "pageNo") int pageNo,
                                           @RequestParam(required = false, defaultValue = "10", value = "size") int size) {
        NoticeDto.NoticeDataListResponse response = noticeService.getNoticeList(pageNo, size);
        return ResponseEntity.ok().body(response);
    }

    /**
     * 공지사항 생성
     */
    @PostMapping()
    public ResponseEntity<?> addNotice(@RequestBody NoticeDto.Request request) {
        boolean response = noticeService.addNotice(request);
        return ResponseEntity.ok().body(response);
    }

    /**
     * 공지사항 상세보기
     */
    @PostMapping("/{noticeId}")
    public ResponseEntity<?> getNoticeDetail(@PathVariable Long noticeId) {
        NoticeDto.Response response = noticeService.getNoticeDetail(noticeId);
        return ResponseEntity.ok().body(response);
    }

}
