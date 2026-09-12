package com.ztech.crm.shared.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

/**
 * Cubre una denegación de acceso resuelta a nivel de filtro (regla por URL en
 * {@code SecurityConfig}), no dentro de un controller. La autorización fina por rol y
 * alcance vive en {@code @PreAuthorize} sobre los métodos de {@code service}
 * (design.md §6) — esas excepciones sí llegan a {@code GlobalExceptionHandler}; este
 * handler es la red de contención para lo que se resuelva antes.
 */
@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                        AccessDeniedException accessDeniedException) throws IOException {
        RestAuthenticationEntryPoint.writeProblem(response, request, HttpStatus.FORBIDDEN, "FORBIDDEN",
                "No tiene permisos para esta operación.");
    }
}
