package dev.pinner.service;

import dev.pinner.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    /**
     * 등록
     */
    public boolean addNotice() {
        return false;
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
    public boolean getNoticeList() {
        return false;
    }

    /**
     * 상세 조회
     */
    public boolean getNoticeDetail() {
        return false;
    }

}
