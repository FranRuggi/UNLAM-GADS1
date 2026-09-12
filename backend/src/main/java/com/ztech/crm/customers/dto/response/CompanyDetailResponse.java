package com.ztech.crm.customers.dto.response;

import com.ztech.crm.customers.domain.enums.PartyStatus;
import java.util.List;

/** {@code GET /api/v1/companies/{id}} incluye sus contactos (BE-CUS-03). */
public record CompanyDetailResponse(
        Long id,
        String name,
        String cuit,
        String industry,
        String email,
        String phone,
        String address,
        String website,
        PartyStatus status,
        Long salesRepId,
        Long originId,
        String notes,
        List<ContactSummaryResponse> contacts
) {
}
