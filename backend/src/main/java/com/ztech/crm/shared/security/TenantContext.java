package com.ztech.crm.shared.security;

import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Punto único para leer el usuario/tenant autenticado del request actual. No es un
 * {@code ThreadLocal} propio: se apoya en el {@code SecurityContextHolder} de Spring
 * Security, que ya queda correctamente acotado y limpiado por request (BE-SEC-03).
 */
public final class TenantContext {

    private TenantContext() {
    }

    public static AuthenticatedUser currentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new IllegalStateException("No hay un usuario autenticado en el contexto actual.");
        }
        return user;
    }

    public static Long currentTenantId() {
        return currentUser().tenantId();
    }
}
