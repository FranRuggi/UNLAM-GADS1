package com.ztech.crm.offerings.mapper;

import com.ztech.crm.offerings.domain.EventService;
import com.ztech.crm.offerings.dto.response.EventServiceResponse;
import org.springframework.stereotype.Component;

@Component
public class EventServiceMapper {

    public EventServiceResponse toResponse(EventService eventService) {
        return new EventServiceResponse(eventService.getId(), eventService.getName(),
                eventService.getDescription(), eventService.getPrice(), eventService.isActive());
    }
}
