package com.example.travelmaprecodebe.domain.traveler;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class ResponseReturnBody {
    Map<String, Object> responseData = new HashMap<>();
    String message;
}
