package com.ztech.crm.offerings.dto.response;

import java.math.BigDecimal;

public record EventServiceResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        boolean active
) {
}
