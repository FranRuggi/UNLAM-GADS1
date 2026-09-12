package com.ztech.crm.offerings.domain;

import com.ztech.crm.shared.audit.TenantOwnedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;

/**
 * Salón (ADR-004) — el "producto o servicio" de la consigna que se reserva. Sólo
 * lectura en E1 (BE-OFF-01): el ABM completo llega en la Fase 6 (BE-OFF-02).
 */
@Entity
@Table(name = "venues")
public class Venue extends TenantOwnedEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    private BigDecimal rate;

    private String address;

    @Column(nullable = false)
    private boolean active = true;

    protected Venue() {
    }

    public Venue(Long tenantId, String name, Integer capacity) {
        super(tenantId);
        this.name = name;
        this.capacity = capacity;
    }

    public void updateDetails(String name, Integer capacity, BigDecimal rate, String address, boolean active) {
        this.name = name;
        this.capacity = capacity;
        this.rate = rate;
        this.address = address;
        this.active = active;
    }

    public String getName() {
        return name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public String getAddress() {
        return address;
    }

    public boolean isActive() {
        return active;
    }
}
