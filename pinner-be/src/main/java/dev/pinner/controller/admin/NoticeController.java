package dev.pinner.controller.admin;

import dev.pinner.domain.dto.NoticeDto;
import dev.pinner.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/notice")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping()
    public ResponseEntity<?> getNoticeList(@RequestParam(required = false, defaultValue = "0", value = "page") int page,
                                           @RequestParam(required = false, defaultValue = "10", value = "size") int size){
        List<NoticeDto.Response> response = noticeService.getNoticeList(page, size);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping()
    public ResponseEntity<?> addNotice(@RequestBody NoticeDto.Request request) {
        boolean response = noticeService.addNotice(request);
        return ResponseEntity.ok().body(response);
    }


}
