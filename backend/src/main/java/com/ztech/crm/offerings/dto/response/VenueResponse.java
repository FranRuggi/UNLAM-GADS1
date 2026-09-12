package com.ztech.crm.offerings.dto.response;

import java.math.BigDecimal;

public record VenueResponse(
        Long id,
        String name,
        Integer capacity,
        BigDecimal rate,
        String address,
        boolean active
) {
}
