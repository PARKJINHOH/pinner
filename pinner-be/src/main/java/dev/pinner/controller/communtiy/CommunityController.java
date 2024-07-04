package dev.pinner.controller.communtiy;

import dev.pinner.domain.dto.CommunitySummaryDto;
import dev.pinner.service.CommunityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    /**
     * 메인페이지
     */
    @GetMapping("/summary")
    public ResponseEntity<?> login(@RequestParam(required = false, defaultValue = "0", value = "pageNo") int pageNo,
                                   @RequestParam(required = false, defaultValue = "3", value = "size") int size) {
        CommunitySummaryDto.Response response = communityService.getSummaryData(pageNo, size);
        return ResponseEntity.ok().body(response);
    }

}
