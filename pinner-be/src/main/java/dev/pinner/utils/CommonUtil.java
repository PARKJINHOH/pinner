package dev.pinner.utils;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;


public class CommonUtil {

    public static String getIpAddress() {
        HttpServletRequest httpServletRequest = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String ip = httpServletRequest.getHeader("X-FORWARDED-FOR");
        if (ip == null){
            ip = httpServletRequest.getRemoteAddr();
        }
        return ip;
    }
}
