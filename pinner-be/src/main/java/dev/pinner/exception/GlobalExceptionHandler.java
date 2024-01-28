package dev.pinner.exception;

import dev.pinner.domain.record.ErrorRecord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * CustomException
     */
    @ExceptionHandler({BusinessException.class})
    public ResponseEntity<Object> handleException(BusinessException ex) {
        log.error("BusinessException ===> ", ex);
        return new ResponseEntity<>(new ErrorRecord(ex.getHttpStatus().value(), ex.getMessage()), ex.getHttpStatus());
    }

    /**
     * CustomException
     */
    @ExceptionHandler({SystemException.class})
    public ResponseEntity<Object> handleException(SystemException ex) {
        log.error("SystemException ===> ", ex.getEx());
        return new ResponseEntity<>(new ErrorRecord(ex.getHttpStatus().value(), ex.getMessage()), ex.getHttpStatus());
    }

    /**
     * @Valid 관련 Exception
     */
    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<Object> handleException(MethodArgumentNotValidException ex) {
        log.error("MethodArgumentNotValidException ===> ", ex);
        return new ResponseEntity<>(new ErrorRecord(HttpStatus.BAD_REQUEST.value(), ex.getBindingResult().getAllErrors().get(0).getDefaultMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({IOException.class})
    public ResponseEntity<Object> handleException(IOException ex) {
        log.error("IOException ===> ", ex);
        return new ResponseEntity<>(new ErrorRecord(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 전역 Exception
     */
    @ExceptionHandler({Exception.class})
    public ResponseEntity<Object> handleException(Exception ex) {
        log.error("Exception ===> ", ex);
        return new ResponseEntity<>(new ErrorRecord(HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버에 문제가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
