package com.example.travelmaprecodebe.controller;

import com.example.travelmaprecodebe.domain.dto.TravelDto;
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
    public void getTravelList(@RequestBody List<TravelDto> travelDto) {
        for (TravelDto dto : travelDto) {
            System.out.println("dto.getOrderKey() = " + dto.getOrderKey());
            System.out.println("dto.getTitle() = " + dto.getTitle());
            for (TravelDto.JourneyDto journey : dto.getJourneys()) {
                System.out.println("journey.getOrderKey() = " + journey.getOrderKey());
                System.out.println("journey.getDate() = " + journey.getDate());
                for (TravelDto.JourneyDto.HashTagDto hashtag : journey.getHashtags()) {
                    System.out.println("hashtag.getTag() = " + hashtag.getTag());
                }
            }
            System.out.println(" ================== ");
        }


    }

}
