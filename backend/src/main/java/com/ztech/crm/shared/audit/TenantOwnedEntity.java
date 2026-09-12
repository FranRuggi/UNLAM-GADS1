package com.ztech.crm.shared.audit;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

/**
 * Base para entidades de negocio propiedad de un tenant (ADR-003). {@code tenantId} se
 * asigna una única vez, desde el tenant del usuario autenticado, y nunca se actualiza.
 * Todo repositorio sobre una subclase filtra por este campo — ver
 * {@code .claude/context/02-backend-convenciones.md} §Multi-tenancy.
 */
@MappedSuperclass
public abstract class TenantOwnedEntity extends AuditableEntity {

    @Column(name = "tenant_id", nullable = false, updatable = false)
    private Long tenantId;

    protected TenantOwnedEntity() {
    }

    protected TenantOwnedEntity(Long tenantId) {
        this.tenantId = tenantId;
    }

    public Long getTenantId() {
        return tenantId;
    }
}
