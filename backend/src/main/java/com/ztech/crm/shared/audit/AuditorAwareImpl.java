package com.ztech.crm.shared.audit;

import com.ztech.crm.shared.security.HasUserId;
import java.util.Optional;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Resuelve el autor de auditoría (createdBy/updatedBy) desde el contexto de seguridad.
 * Sin sesión autenticada (p. ej. una migración o un job) no hay autor: los campos
 * quedan {@code null} en vez de asumir un usuario del sistema inexistente.
 */
@Component("auditorAware")
public class AuditorAwareImpl implements AuditorAware<Long> {

    @Override
    public Optional<Long> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        if (authentication.getPrincipal() instanceof HasUserId hasUserId) {
            return Optional.of(hasUserId.getUserId());
        }
        return Optional.empty();
    }
}
