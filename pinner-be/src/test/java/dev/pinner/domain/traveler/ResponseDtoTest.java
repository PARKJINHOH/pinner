package dev.pinner.domain.traveler;

import dev.pinner.domain.dto.ResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class ResponseDtoTest {
    @Test
    void assertIgnoreEmptyMap() throws Exception{
        ResponseDto hello_world = new ResponseDto("hello world");
        ObjectMapper objectMapper = new ObjectMapper();
        String s = objectMapper.writeValueAsString(hello_world);
        Assertions.assertFalse(s.contains("data"));
    }
}