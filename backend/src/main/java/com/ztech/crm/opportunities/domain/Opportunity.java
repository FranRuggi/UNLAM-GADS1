package com.ztech.crm.opportunities.domain;

import com.ztech.crm.opportunities.domain.enums.OpportunityStatus;
import com.ztech.crm.shared.audit.TenantOwnedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * BE-OPP-01..03. Todo FK a otro módulo (empresa, contacto, responsable, salón, etapa,
 * origen, motivo de pérdida) es un {@code Long} plano, nunca un {@code @ManyToOne}
 * cruzando módulos (ADR-001) — se resuelven llamando al `service` dueño de cada uno.
 *
 * <p>El cambio de etapa, la asignación de responsable y el cierre (ganada/perdida) no
 * son ediciones genéricas: tienen sus propios casos de uso (Fase 4/7), así que
 * {@code stageId}, {@code salesRepId} y {@code status} no se tocan desde
 * {@link #updateDetails}.
 */
@Entity
@Table(name = "opportunities")
public class Opportunity extends TenantOwnedEntity {

    @Column(nullable = false)
    private String title;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "contact_id")
    private Long contactId;

    @Column(name = "sales_rep_id", nullable = false)
    private Long salesRepId;

    @Column(name = "venue_id", nullable = false)
    private Long venueId;

    @Column(name = "stage_id", nullable = false)
    private Long stageId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OpportunityStatus status;

    @Column(name = "estimated_value")
    private BigDecimal estimatedValue;

    @Column(name = "final_value")
    private BigDecimal finalValue;

    private Integer probability;

    @Column(name = "event_date", nullable = false)
    private Instant eventDate;

    @Column(name = "attendee_count", nullable = false)
    private Integer attendeeCount;

    @Column(name = "estimated_close_date")
    private LocalDate estimatedCloseDate;

    @Column(name = "closed_at")
    private Instant closedAt;

    @Column(name = "origin_id")
    private Long originId;

    @Column(name = "loss_reason_id")
    private Long lossReasonId;

    private String notes;

    @Version
    private Long version;

    protected Opportunity() {
    }

    public Opportunity(Long tenantId, String title, Long companyId, Long contactId, Long salesRepId,
                        Long venueId, Long stageId, Instant eventDate, Integer attendeeCount) {
        super(tenantId);
        this.title = title;
        this.companyId = companyId;
        this.contactId = contactId;
        this.salesRepId = salesRepId;
        this.venueId = venueId;
        this.stageId = stageId;
        this.eventDate = eventDate;
        this.attendeeCount = attendeeCount;
        this.status = OpportunityStatus.ABIERTA;
    }

    /**
     * Cambio de etapa (Fase 4) — deliberadamente separado de {@link #updateDetails}:
     * no es una edición genérica, es un caso de uso propio con su propio historial
     * (docs/arquitectura/02-modulos-y-capas.md). {@code ChangeStageService} es quien
     * decide si el destino es válido antes de llamar acá.
     */
    public void changeStage(Long newStageId) {
        this.stageId = newStageId;
    }

    public void updateDetails(String title, Long companyId, Long contactId, Long venueId,
                               BigDecimal estimatedValue, Integer probability, Instant eventDate,
                               Integer attendeeCount, LocalDate estimatedCloseDate, Long originId, String notes) {
        this.title = title;
        this.companyId = companyId;
        this.contactId = contactId;
        this.venueId = venueId;
        this.estimatedValue = estimatedValue;
        this.probability = probability;
        this.eventDate = eventDate;
        this.attendeeCount = attendeeCount;
        this.estimatedCloseDate = estimatedCloseDate;
        this.originId = originId;
        this.notes = notes;
    }

    public String getTitle() {
        return title;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public Long getContactId() {
        return contactId;
    }

    public Long getSalesRepId() {
        return salesRepId;
    }

    public Long getVenueId() {
        return venueId;
    }

    public Long getStageId() {
        return stageId;
    }

    public OpportunityStatus getStatus() {
        return status;
    }

    public BigDecimal getEstimatedValue() {
        return estimatedValue;
    }

    public BigDecimal getFinalValue() {
        return finalValue;
    }

    public Integer getProbability() {
        return probability;
    }

    public Instant getEventDate() {
        return eventDate;
    }

    public Integer getAttendeeCount() {
        return attendeeCount;
    }

    public LocalDate getEstimatedCloseDate() {
        return estimatedCloseDate;
    }

    public Instant getClosedAt() {
        return closedAt;
    }

    public Long getOriginId() {
        return originId;
    }

    public Long getLossReasonId() {
        return lossReasonId;
    }

    public String getNotes() {
        return notes;
    }
}
