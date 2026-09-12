package com.ztech.crm.offerings.domain;

import com.ztech.crm.shared.audit.TenantOwnedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;

/**
 * Servicio adicional (catering, audio, decoración — ADR-004). No se reserva ni tiene
 * capacidad, a diferencia de {@link Venue}. Sólo lectura en E1 (BE-OFF-03).
 */
@Entity
@Table(name = "event_services")
public class EventService extends TenantOwnedEntity {

    @Column(nullable = false)
    private String name;

    private String description;

    private BigDecimal price;

    @Column(nullable = false)
    private boolean active = true;

    protected EventService() {
    }

    public EventService(Long tenantId, String name) {
        super(tenantId);
        this.name = name;
    }

    public void updateDetails(String name, String description, BigDecimal price, boolean active) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.active = active;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public boolean isActive() {
        return active;
    }
}
