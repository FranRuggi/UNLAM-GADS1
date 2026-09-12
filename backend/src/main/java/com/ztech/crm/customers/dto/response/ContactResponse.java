package com.ztech.crm.customers.dto.response;

import com.ztech.crm.customers.domain.enums.PartyStatus;

/** Para listados — con el nombre de la empresa aplanado, sin el detalle completo. */
public record ContactResponse(
        Long id,
        Long companyId,
        String companyName,
        String firstName,
        String lastName,
        String email,
        String phone,
        PartyStatus status
) {
}
