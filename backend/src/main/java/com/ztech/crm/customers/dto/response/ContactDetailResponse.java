package com.ztech.crm.customers.dto.response;

import com.ztech.crm.customers.domain.enums.PartyStatus;

public record ContactDetailResponse(
        Long id,
        CompanySummaryResponse company,
        String firstName,
        String lastName,
        String document,
        String position,
        String email,
        String phone,
        PartyStatus status,
        Long salesRepId,
        Long originId,
        String notes
) {
}
