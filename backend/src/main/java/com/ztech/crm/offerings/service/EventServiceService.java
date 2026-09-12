package com.ztech.crm.offerings.service;

import com.ztech.crm.offerings.domain.EventService;
import com.ztech.crm.offerings.dto.response.EventServiceResponse;
import com.ztech.crm.offerings.mapper.EventServiceMapper;
import com.ztech.crm.offerings.repository.EventServiceRepository;
import com.ztech.crm.shared.exception.NotFoundException;
import com.ztech.crm.shared.security.TenantContext;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * BE-OFF-03. Sólo lectura en E1; el ABM llega en la Fase 6 (BE-OFF-04). El nombre
 * repite "Service" dos veces porque la entidad de dominio ya se llama
 * {@code EventService} (ADR-004) — se mantiene por consistencia con el resto de los
 * módulos en vez de romper la convención de nombres para este único caso.
 */
@Service
public class EventServiceService {

    private final EventServiceRepository eventServiceRepository;
    private final EventServiceMapper eventServiceMapper;

    public EventServiceService(EventServiceRepository eventServiceRepository, EventServiceMapper eventServiceMapper) {
        this.eventServiceRepository = eventServiceRepository;
        this.eventServiceMapper = eventServiceMapper;
    }

    @Transactional(readOnly = true)
    public List<EventServiceResponse> list() {
        Long tenantId = TenantContext.currentTenantId();
        return eventServiceRepository.findAllByTenantIdOrderByName(tenantId).stream()
                .map(eventServiceMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventServiceResponse getDetail(Long id) {
        Long tenantId = TenantContext.currentTenantId();
        EventService eventService = eventServiceRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new NotFoundException("No se encontró el servicio solicitado."));
        return eventServiceMapper.toResponse(eventService);
    }
}
