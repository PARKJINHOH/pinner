package com.example.travelmaprecodebe.controller;

import com.example.travelmaprecodebe.domain.dto.ResponseTravelDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/api/travel")
@RequiredArgsConstructor
public class TravelController {


    @PostMapping("/api/test")
    public void getTravelList(@RequestBody List<ResponseTravelDto> responseTravelDto) {
        for (ResponseTravelDto dto : responseTravelDto) {
            System.out.println("dto.getOrderKey() = " + dto.getOrderKey());
            System.out.println("dto.getTitle() = " + dto.getTitle());
            for (ResponseTravelDto.JourneyDto journey : dto.getJourneys()) {
                System.out.println("journey.getOrderKey() = " + journey.getOrderKey());
                System.out.println("journey.getDate() = " + journey.getDate());
                for (ResponseTravelDto.JourneyDto.HashTagDto hashtag : journey.getHashtags()) {
                    System.out.println("hashtag.getTag() = " + hashtag.getTag());
                }
            }
            System.out.println(" ================== ");
        }


    }

}
