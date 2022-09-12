package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.domain.dto.ResponseTravelDto;
import com.example.travelmaprecodebe.repository.TravelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelService {

    private final TravelRepository travelRepository;

    public void postTravelList(List<ResponseTravelDto> responseTravelDto) {
        if(!responseTravelDto.isEmpty()){
            for (ResponseTravelDto travelDto : responseTravelDto) {
                travelRepository.save(travelDto.toEntity());
            }
        }
    }
}
