package com.ztech.crm.customers.dto.response;

import com.ztech.crm.customers.domain.enums.PartyStatus;

/** Para listados — sin la lista de contactos (eso sólo va en el detalle). */
public record CompanyResponse(
        Long id,
        String name,
        String cuit,
        String industry,
        String email,
        String phone,
        PartyStatus status,
        Long salesRepId
) {
}
