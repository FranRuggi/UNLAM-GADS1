package com.ztech.crm.opportunities.service;

import com.ztech.crm.catalogs.dto.response.StageResponse;
import com.ztech.crm.catalogs.service.StageService;
import com.ztech.crm.customers.dto.response.CompanySummaryResponse;
import com.ztech.crm.customers.dto.response.ContactSummaryResponse;
import com.ztech.crm.customers.service.CompanyService;
import com.ztech.crm.customers.service.ContactService;
import com.ztech.crm.offerings.dto.response.VenueResponse;
import com.ztech.crm.offerings.service.VenueService;
import com.ztech.crm.opportunities.domain.Opportunity;
import com.ztech.crm.opportunities.domain.enums.OpportunityStatus;
import com.ztech.crm.opportunities.dto.request.CreateOpportunityRequest;
import com.ztech.crm.opportunities.dto.request.UpdateOpportunityRequest;
import com.ztech.crm.opportunities.dto.response.OpportunityBoardResponse;
import com.ztech.crm.opportunities.dto.response.OpportunityDetailResponse;
import com.ztech.crm.opportunities.dto.response.OpportunityResponse;
import com.ztech.crm.opportunities.mapper.OpportunityMapper;
import com.ztech.crm.opportunities.repository.OpportunityRepository;
import com.ztech.crm.shared.dto.PageResponse;
import com.ztech.crm.shared.exception.BusinessException;
import com.ztech.crm.shared.exception.ConflictException;
import com.ztech.crm.shared.exception.NotFoundException;
import com.ztech.crm.shared.security.TenantContext;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * BE-OPP-01..03. {@code opportunities} coordina referencias a clientes, salón, etapa y
 * responsable llamando al `service` dueño de cada módulo — nunca a su repositorio
 * (docs/arquitectura/02-modulos-y-capas.md, ADR-001).
 */
@Service
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final OpportunityMapper opportunityMapper;
    private final CompanyService companyService;
    private final ContactService contactService;
    private final VenueService venueService;
    private final StageService stageService;

    public OpportunityService(OpportunityRepository opportunityRepository, OpportunityMapper opportunityMapper,
                               CompanyService companyService, ContactService contactService,
                               VenueService venueService, StageService stageService) {
        this.opportunityRepository = opportunityRepository;
        this.opportunityMapper = opportunityMapper;
        this.companyService = companyService;
        this.contactService = contactService;
        this.venueService = venueService;
        this.stageService = stageService;
    }

    @Transactional
    public OpportunityResponse create(CreateOpportunityRequest request) {
        Long tenantId = TenantContext.currentTenantId();
        assertHasPartyOrThrow(request.companyId(), request.contactId());
        assertPartiesExist(request.companyId(), request.contactId());
        venueService.getActiveOrThrow(request.venueId());
        stageService.assertOpenAndActive(request.stageId());

        Opportunity opportunity = new Opportunity(tenantId, request.title(), request.companyId(),
                request.contactId(), request.salesRepId(), request.venueId(), request.stageId(),
                request.eventDate(), request.attendeeCount());
        opportunity.updateDetails(request.title(), request.companyId(), request.contactId(), request.venueId(),
                request.estimatedValue(), request.probability(), request.eventDate(), request.attendeeCount(),
                request.estimatedCloseDate(), request.originId(), request.notes());

        return opportunityMapper.toResponse(opportunityRepository.save(opportunity));
    }

    @Transactional
    public OpportunityResponse update(Long id, UpdateOpportunityRequest request) {
        Opportunity opportunity = getOwnedOrThrow(id);
        assertOpenOrThrow(opportunity);
        assertHasPartyOrThrow(request.companyId(), request.contactId());
        assertPartiesExist(request.companyId(), request.contactId());
        venueService.getActiveOrThrow(request.venueId());

        opportunity.updateDetails(request.title(), request.companyId(), request.contactId(), request.venueId(),
                request.estimatedValue(), request.probability(), request.eventDate(), request.attendeeCount(),
                request.estimatedCloseDate(), request.originId(), request.notes());

        return opportunityMapper.toResponse(opportunityRepository.save(opportunity));
    }

    @Transactional(readOnly = true)
    public OpportunityDetailResponse getDetail(Long id) {
        Opportunity opportunity = getOwnedOrThrow(id);

        CompanySummaryResponse company = opportunity.getCompanyId() == null
                ? null : companyService.getSummary(opportunity.getCompanyId());
        ContactSummaryResponse contact = opportunity.getContactId() == null
                ? null : contactService.getSummary(opportunity.getContactId());
        VenueResponse venue = venueService.getDetail(opportunity.getVenueId());
        StageResponse stage = stageService.getSummary(opportunity.getStageId());

        return opportunityMapper.toDetailResponse(opportunity, company, contact, venue, stage);
    }

    @Transactional(readOnly = true)
    public PageResponse<OpportunityResponse> list(Pageable pageable) {
        Long tenantId = TenantContext.currentTenantId();
        Page<Opportunity> page = opportunityRepository.findAllByTenantId(tenantId, pageable);
        return PageResponse.from(page, opportunityMapper::toResponse);
    }

    /** BE-OPP-06. Todas las etapas del tenant como columnas, incluidas WON/LOST — sin paginar. */
    @Transactional(readOnly = true)
    public OpportunityBoardResponse getBoard() {
        Long tenantId = TenantContext.currentTenantId();

        Map<Long, List<OpportunityResponse>> byStage = opportunityRepository.findAllByTenantId(tenantId).stream()
                .map(opportunityMapper::toResponse)
                .collect(Collectors.groupingBy(OpportunityResponse::stageId));

        List<OpportunityBoardResponse.StageColumn> columns = stageService.list().stream()
                .map(stage -> new OpportunityBoardResponse.StageColumn(
                        stage.id(), stage.name(), byStage.getOrDefault(stage.id(), List.of())))
                .toList();

        return new OpportunityBoardResponse(columns);
    }

    private Opportunity getOwnedOrThrow(Long id) {
        Long tenantId = TenantContext.currentTenantId();
        return opportunityRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new NotFoundException("No se encontró la oportunidad solicitada."));
    }

    private void assertOpenOrThrow(Opportunity opportunity) {
        // BE-OPP-09: una oportunidad cerrada no se modifica sin autorización. Hoy
        // ninguna oportunidad puede estar cerrada todavía (ganar/perder es Fase 7),
        // pero la regla queda aplicada desde ya para no tener que revisitarla.
        if (opportunity.getStatus() != OpportunityStatus.ABIERTA) {
            throw new ConflictException("OPPORTUNITY_CLOSED", "No se puede modificar una oportunidad cerrada.");
        }
    }

    private void assertHasPartyOrThrow(Long companyId, Long contactId) {
        // RN-02 de la consigna: toda oportunidad se asocia, como mínimo, a una
        // empresa o un contacto.
        if (companyId == null && contactId == null) {
            throw new BusinessException("OPPORTUNITY_WITHOUT_PARTY",
                    "La oportunidad debe estar asociada a una empresa o a un contacto.");
        }
    }

    private void assertPartiesExist(Long companyId, Long contactId) {
        if (companyId != null) {
            companyService.assertExists(companyId);
        }
        if (contactId != null) {
            contactService.assertExists(contactId);
        }
    }
}
