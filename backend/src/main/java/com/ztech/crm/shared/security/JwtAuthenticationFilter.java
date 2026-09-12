package com.ztech.crm.shared.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.MDC;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Reconstruye el {@link AuthenticatedUser} directamente desde los claims del JWT
 * (sin volver a consultar la base en cada request — stateless de verdad) y lo deja en
 * el {@code SecurityContext} para el resto del pipeline (BE-SEC-02/03). De paso agrega
 * {@code tenantId}/{@code userId} al MDC (docs/arquitectura/01-arquitectura-general.md:
 * "los logs incluyen requestId, userId y tenantId") — se limpia siempre en el
 * {@code finally}, porque Tomcat reutiliza hilos entre requests distintos.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String MDC_TENANT_ID = "tenantId";
    private static final String MDC_USER_ID = "userId";

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        boolean authenticated = false;

        if (header != null && header.startsWith(BEARER_PREFIX)) {
            String token = header.substring(BEARER_PREFIX.length());
            AuthenticatedUser user = jwtService.parseToken(token);

            var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            MDC.put(MDC_TENANT_ID, String.valueOf(user.tenantId()));
            MDC.put(MDC_USER_ID, String.valueOf(user.userId()));
            authenticated = true;
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            if (authenticated) {
                MDC.remove(MDC_TENANT_ID);
                MDC.remove(MDC_USER_ID);
            }
        }
    }
}
