package com.ztech.crm.customers.domain;

import com.ztech.crm.customers.domain.enums.PartyStatus;
import com.ztech.crm.shared.audit.TenantOwnedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

/**
 * Empresa (BE-CUS-01..03). {@code salesRepId} y {@code originId} son referencias por id
 * a {@code access.User} y {@code catalogs.Origin} — sin relación JPA cruzando módulos
 * (ADR-001): resolverlas, si hace falta, es responsabilidad del `service` dueño de esos
 * módulos, no de un `@ManyToOne` acá.
 */
@Entity
@Table(name = "companies")
public class Company extends TenantOwnedEntity {

    @Column(nullable = false)
    private String name;

    private String cuit;

    private String industry;

    private String email;

    private String phone;

    private String address;

    private String website;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PartyStatus status;

    @Column(name = "sales_rep_id")
    private Long salesRepId;

    @Column(name = "origin_id")
    private Long originId;

    private String notes;

    protected Company() {
    }

    public Company(Long tenantId, String name, PartyStatus status) {
        super(tenantId);
        this.name = name;
        this.status = status;
    }

    public void updateDetails(String name, String cuit, String industry, String email, String phone,
                               String address, String website, PartyStatus status, Long salesRepId,
                               Long originId, String notes) {
        this.name = name;
        this.cuit = cuit;
        this.industry = industry;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.website = website;
        this.status = status;
        this.salesRepId = salesRepId;
        this.originId = originId;
        this.notes = notes;
    }

    public String getName() {
        return name;
    }

    public String getCuit() {
        return cuit;
    }

    public String getIndustry() {
        return industry;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public String getWebsite() {
        return website;
    }

    public PartyStatus getStatus() {
        return status;
    }

    public Long getSalesRepId() {
        return salesRepId;
    }

    public Long getOriginId() {
        return originId;
    }

    public String getNotes() {
        return notes;
    }
}
