package dev.pinner.service;

import dev.pinner.domain.dto.CommunityDto;
import dev.pinner.domain.dto.NoticeDto;
import dev.pinner.repository.NoticeRepository;
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
//    private final RecommTravelRepository recommTravelRepository;
//    private final CommunityRepository communityRepository;
//    private final QnaRepository qnaRepository;


    public CommunityDto.Response getSummaryData(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.DESC, "id"));
        Page<NoticeDto.CommunitySummaryResponse> map = noticeRepository.findAll(pageable).map(NoticeDto.CommunitySummaryResponse::new);

        CommunityDto.Response response = CommunityDto.Response.builder()
                .noticeList(map.getContent())
                .build();

        return response;

    }


}
