package dev.pinner.controller.admin;

import dev.pinner.domain.dto.AdminDto;
import dev.pinner.domain.dto.TravelerDto;
import dev.pinner.domain.entity.Travel;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.service.AdminService;
import dev.pinner.service.TravelerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final TravelerService travelerService;

    /**
     * 관리자 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminDto.Request request) {
        AdminDto.Response response = adminService.doLogin(request);
        return ResponseEntity.ok().body(response);
    }

    /**
     * 사용자 데이터
     */
    @PostMapping("/dashboard/summary")
    public ResponseEntity<?> getSummaryData() {
        List<Traveler> totalTraveler = travelerService.getTotalTraveler();
        long totalActiveTraveler = totalTraveler.stream().filter(Traveler::getState).count();
        long totalInactiveTraveler = totalTraveler.size() - totalActiveTraveler;

        List<Travel> totalTravel = travelerService.getTotalTravel();

        List<TravelerDto.SummaryResponse> travelerGroupByYearMonth = travelerService.getTravelerGroupByYearMonth();


        AdminDto.SummaryResponse response = AdminDto.SummaryResponse.builder()
                .totalTraveler(totalTraveler.size())
                .activeTraveler((int) totalActiveTraveler)
                .inactiveTraveler((int) totalInactiveTraveler)
                .totalTravel(totalTravel.size())
                .travelerGroupByYearMonthList(travelerGroupByYearMonth)
                .build();

        return ResponseEntity.ok().body(response);
    }

    /**
     * 공지사항
     */
    @PostMapping("/notice/list")
    public ResponseEntity<?> getNoticeList() {


        return ResponseEntity.ok().body(null);
    }

    /**
     * Token 갱신
     */
    @PostMapping("/renewal/token")
    public ResponseEntity<?> refreshToken(@RequestBody AdminDto.Request adminDto) {
        AdminDto.Response response = adminService.getRefreshToken(adminDto);
        return ResponseEntity.ok().body(response);
    }

}
