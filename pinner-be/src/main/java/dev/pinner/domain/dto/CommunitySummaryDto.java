package dev.pinner.domain.dto;

import dev.pinner.domain.entity.RecommTravel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


public class CommunitySummaryDto {

    @Data
    @Builder
    @AllArgsConstructor
    public static class Response {
        List<NoticeDto.CommunitySummaryResponse> noticeList;
        List<RecommTravelDto.CommunitySummaryResponse> recommTravelList;
        List<CommunityDto.CommunitySummaryResponse>  communityList;
//        List<Qna> qnaList = new ArrayList<>();
    }

}
