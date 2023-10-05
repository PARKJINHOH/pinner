package com.example.travelmaprecodebe.config;

import com.example.travelmaprecodebe.utils.RandomHexStringGenerator;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import java.io.IOException;

@Order(Ordered.HIGHEST_PRECEDENCE)
@Component
public class MDCRequestIDFilter implements Filter {
    static final String _MDC_KEY = "reqId";
    final RandomHexStringGenerator requestIDGenerator = new RandomHexStringGenerator();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        MDC.put(_MDC_KEY, requestIDGenerator.generate(4));

        try {
            chain.doFilter(request, response);
        } finally {
            MDC.remove(_MDC_KEY);
        }
    }
}
