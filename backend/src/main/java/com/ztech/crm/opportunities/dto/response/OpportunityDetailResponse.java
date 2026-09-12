package com.ztech.crm.opportunities.dto.response;

import com.ztech.crm.catalogs.dto.response.StageResponse;
import com.ztech.crm.customers.dto.response.CompanySummaryResponse;
import com.ztech.crm.customers.dto.response.ContactSummaryResponse;
import com.ztech.crm.offerings.dto.response.VenueResponse;
import com.ztech.crm.opportunities.domain.enums.OpportunityStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * BE-OPP-03: cliente, salón y etapa resueltos. {@code salesRepId} queda como id plano
 * — el módulo {@code access} todavía no tiene un {@code UserService} de propósito
 * general para resolver nombres (llega en la Fase 6, BE-ACC-02/03).
 */
public record OpportunityDetailResponse(
        Long id,
        String title,
        CompanySummaryResponse company,
        ContactSummaryResponse contact,
        Long salesRepId,
        VenueResponse venue,
        StageResponse stage,
        OpportunityStatus status,
        BigDecimal estimatedValue,
        BigDecimal finalValue,
        Integer probability,
        Instant eventDate,
        Integer attendeeCount,
        LocalDate estimatedCloseDate,
        Instant closedAt,
        Long originId,
        Long lossReasonId,
        String notes
) {
}
