package dev.pinner.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;


public class CommunityDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response {
        List<NoticeDto.CommunitySummaryResponse> noticeList;
//        List<Community> communityList = new arrayList<>();
//        List<RecommTravel> recommTravelList = new ArrayList<>();
//        List<Qna> qnaList = new ArrayList<>();
    }

}
