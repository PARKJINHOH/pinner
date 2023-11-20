package dev.pinner.exception;

import dev.pinner.domain.dto.ErrorDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ExceptionHandler가 붙은 함수는 꼭 protected / private 사용하기
    // 외부에서 함수를 부르게 되면 그대로 에러 객체를 리턴한다.

    /**
     * CustomException
     */
    @ExceptionHandler({CustomException.class})
    protected ResponseEntity<Object> handleCustomException(CustomException ex) {
        log.error("CustomException ===> ", ex);
        return new ResponseEntity<>(new ErrorDto(ex.getHttpStatus().value(), ex.getMessage()), ex.getHttpStatus());
    }


    /**
     * @Valid 관련 Exception
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleValidationException(MethodArgumentNotValidException ex) {
        log.error("MethodArgumentNotValidException ===> ", ex);
        return new ResponseEntity<>(new ErrorDto(HttpStatus.BAD_REQUEST.value(), ex.getBindingResult().getAllErrors().get(0).getDefaultMessage()), HttpStatus.BAD_REQUEST);
    }

    /**
     * 전역 Exception
     */
    @ExceptionHandler({Exception.class})
    protected ResponseEntity<Object> handleServerException(Exception ex) {
        log.error("Exception ===> ", ex);
        return new ResponseEntity<>(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버에 문제가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
