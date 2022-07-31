package com.example.travelmaprecodebe.domain.traveler;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class ResponseDto {
    Map<String, Object> data = new HashMap<>();
    String message;
}
