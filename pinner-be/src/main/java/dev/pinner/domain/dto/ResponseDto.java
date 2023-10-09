package dev.pinner.domain.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ResponseDto {
    Map<String, Object> data = new HashMap<>();
    String message;

    public ResponseDto(String message) {
        this.message = message;
    }

    public ResponseDto(Map<String, Object> data) {
        this.data = data;
    }
}
