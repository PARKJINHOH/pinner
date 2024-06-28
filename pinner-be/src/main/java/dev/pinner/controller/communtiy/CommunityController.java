package dev.pinner.controller.communtiy;

import dev.pinner.domain.dto.AdminDto;
import dev.pinner.domain.dto.CommunityDto;
import dev.pinner.domain.dto.TravelerDto;
import dev.pinner.domain.entity.Travel;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.service.AdminService;
import dev.pinner.service.CommunityService;
import dev.pinner.service.TravelerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        CommunityDto.Response response = communityService.getSummaryData(pageNo, size);
        return ResponseEntity.ok().body(response);
    }

}
