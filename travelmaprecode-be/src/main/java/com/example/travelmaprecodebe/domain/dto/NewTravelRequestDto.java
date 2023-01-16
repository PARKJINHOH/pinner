package com.example.travelmaprecodebe.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NewTravelRequestDto {

    Long id;
    String title;
    Integer orderKey;
}
