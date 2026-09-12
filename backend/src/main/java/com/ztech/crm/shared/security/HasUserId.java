package com.ztech.crm.shared.security;

/**
 * Contrato mínimo para resolver el autor de auditoría sin acoplar
 * {@link com.ztech.crm.shared.audit.AuditorAwareImpl} a la clase concreta de sesión
 * autenticada, que se define en el módulo {@code access} (Fase 1). El {@code principal}
 * de la autenticación implementa esta interfaz una vez que existe el login con JWT.
 */
public interface HasUserId {

    Long getUserId();
}
