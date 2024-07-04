package dev.pinner.service;

import dev.pinner.domain.dto.CommunityDto;
import dev.pinner.domain.dto.CommunitySummaryDto;
import dev.pinner.domain.dto.NoticeDto;
import dev.pinner.domain.dto.RecommTravelDto;
import dev.pinner.repository.CommunityRepository;
import dev.pinner.repository.NoticeRepository;
import dev.pinner.repository.RecommTravelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityService {

    private final NoticeRepository noticeRepository;
    private final RecommTravelRepository recommTravelRepository;
    private final CommunityRepository communityRepository;
//    private final QnaRepository qnaRepository;


    public CommunitySummaryDto.Response getSummaryData(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.DESC, "id"));

        // 공지사항
        Page<NoticeDto.CommunitySummaryResponse> noticeList = noticeRepository.findAll(pageable).map(NoticeDto.CommunitySummaryResponse::new);

        // 추천 여행지
        Page<RecommTravelDto.CommunitySummaryResponse> recommTravelList = recommTravelRepository.findAll(pageable).map(RecommTravelDto.CommunitySummaryResponse::new);

        // 커뮤니티
        Page<CommunityDto.CommunitySummaryResponse> communityList = communityRepository.findAll(pageable).map(CommunityDto.CommunitySummaryResponse::new);


        CommunitySummaryDto.Response response = CommunitySummaryDto.Response.builder()
                .noticeList(noticeList.getContent())
                .recommTravelList(recommTravelList.getContent())
                .communityList(communityList.getContent())
                .build();

        return response;

    }


}
