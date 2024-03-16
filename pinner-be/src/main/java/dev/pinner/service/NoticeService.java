package dev.pinner.service;

import dev.pinner.domain.dto.NoticeDto;
import dev.pinner.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    /**
     * 등록
     */
    @Transactional
    public boolean addNotice(NoticeDto.Request noticeDto) {
        Long id = noticeRepository.save(noticeDto.toEntity()).getId();
        return id != null;
    }

    /**
     * 수정
     */
    public boolean modifyNotice() {
        return false;
    }

    /**
     * 삭제
     */
    public boolean deleteNotice() {
        return false;
    }

    /**
     * 목록 조회
     */
    public NoticeDto.NoticeDataListResponse getNoticeList(int pageNo, int pageSize) {
        noticeRepository.flush();

        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.DESC, "id"));
        Page<NoticeDto.Response> map = noticeRepository.findAll(pageable).map(NoticeDto.Response::new);
        long totalPageCnt = noticeRepository.count();

        return NoticeDto.NoticeDataListResponse.builder()
                .noticeList(map.getContent())
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalPageCnt((int) totalPageCnt)
                .build();
    }

    /**
     * 상세 조회
     */
    public boolean getNoticeDetail() {
        return false;
    }
}
