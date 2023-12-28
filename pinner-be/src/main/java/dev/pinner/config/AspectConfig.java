package dev.pinner.config;

import dev.pinner.domain.entity.Log;
import dev.pinner.global.utils.CommonUtil;
import dev.pinner.repository.LogsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


/**
 * Todo : 통일 필요
 * select : select , find
 * insert : insert, add, save
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
    private final LogsRepository logsRepository;

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

    private void saveLog(JoinPoint joinPoint, String prcsCd) {
        String ipAddress = getIp();

        Log log = Log.builder()
                .actionType(prcsCd)
                .packagePath(joinPoint.getTarget().toString())
                .method(joinPoint.getSignature().getName())
                .ip(ipAddress)
                .build();

        logsRepository.save(log);
    }

    private String getIp() {
        String ipAddress = "127.0.0.1";
        if (!profiles.equals("local")) {
            ipAddress = CommonUtil.getIpAddress();
        }
        return ipAddress;
    }

}
