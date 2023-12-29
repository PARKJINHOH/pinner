package dev.pinner.config;

import dev.pinner.domain.entity.ErrLog;
import dev.pinner.domain.entity.SysLog;
import dev.pinner.global.utils.CommonUtil;
import dev.pinner.repository.ErrLogRepository;
import dev.pinner.repository.SysLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


/**
 * insert : insert, add, save
 * select : select , find
 * delete : delete, remove
 * update : update
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AspectConfig {

    @Value("${spring.profiles.active}")
    private String profiles;

    private final SysLogRepository sysLogRepository;
    private final ErrLogRepository errLogRepository;

    // AfterReturning advice: 서비스 메소드 실행 후에 로그 저장
    @AfterReturning(pointcut = "execution(public * dev.pinner.service..*save*(..)) || execution(public * dev.pinner.service..*add*(..)) || execution(public * dev.pinner.service..*insert*(..))", returning = "result")
    public void aspectInsertSystemLog(JoinPoint joinPoint, Object result) {
        saveLog(joinPoint, "C");
    }

    @AfterReturning(pointcut = "execution(public * dev.pinner.service..*find*(..)) || execution(public * dev.pinner.service..*get*(..))", returning = "result")
    public void aspectSelectSystemLog(JoinPoint joinPoint, Object result) {
        saveLog(joinPoint, "R");
    }

    @AfterReturning(pointcut = "execution(public * dev.pinner.service..*update*(..))", returning = "result")
    public void aspectUpdateSystemLog(JoinPoint joinPoint, Object result) {
        saveLog(joinPoint, "U");
    }

    @AfterReturning(pointcut = "execution(public * dev.pinner.service..*delete*(..)) || execution(public * dev.pinner.service..*remove*(..))", returning = "result")
    public void aspectDeleteSystemLog(JoinPoint joinPoint, Object result) {
        saveLog(joinPoint, "D");
    }

    /**
     * 서비스 에러 로그 수집
     */
    @AfterThrowing(value = "execution(public * dev.pinner.controller.*..*(..))", throwing = "ex")
    public void aspectErrorSystemLog(JoinPoint joinPoint, Exception ex) {
        logException(joinPoint, ex);
    }

    private void saveLog(JoinPoint joinPoint, String prcsCd) {
        SysLog sysLog = SysLog.builder()
                .actionType(prcsCd)
                .packagePath(joinPoint.getTarget().toString())
                .method(joinPoint.getSignature().getName())
                .ip(getIp())
                .build();

        sysLogRepository.save(sysLog);
    }

    private void logException(JoinPoint joinPoint, Exception exception){
        ErrLog errLog = ErrLog.builder()
                .packagePath(joinPoint.getTarget().toString())
                .method(joinPoint.getSignature().getName())
                .err_msg(exception.getMessage())
                .ip(getIp())
                .build();

        errLogRepository.save(errLog);
    }

    private String getIp() {
        return profiles.equals("local") ? "127.0.0.1" : CommonUtil.getIpAddress();
    }

}
