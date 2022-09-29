package com.example.travelmaprecodebe.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;

@Data
@NoArgsConstructor
public class NewTravelRequestDto {

    @NonNull
    String title;
}
