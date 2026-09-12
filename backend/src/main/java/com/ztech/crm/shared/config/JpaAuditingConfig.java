package com.ztech.crm.shared.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Activa {@code @CreatedDate}/{@code @CreatedBy}/{@code @LastModifiedDate}/
 * {@code @LastModifiedBy} sobre {@link com.ztech.crm.shared.audit.AuditableEntity}.
 * El autor se resuelve con el bean {@code auditorAware}
 * ({@link com.ztech.crm.shared.audit.AuditorAwareImpl}).
 */
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class JpaAuditingConfig {
}
