package com.ztech.crm.customers.service;

import com.ztech.crm.customers.domain.Company;
import com.ztech.crm.customers.domain.Contact;
import com.ztech.crm.customers.dto.request.CompanyRequest;
import com.ztech.crm.customers.dto.response.CompanyDetailResponse;
import com.ztech.crm.customers.dto.response.CompanyResponse;
import com.ztech.crm.customers.dto.response.CompanySummaryResponse;
import com.ztech.crm.customers.mapper.CompanyMapper;
import com.ztech.crm.customers.repository.CompanyRepository;
import com.ztech.crm.customers.repository.ContactRepository;
import com.ztech.crm.shared.dto.PageResponse;
import com.ztech.crm.shared.exception.ConflictException;
import com.ztech.crm.shared.exception.NotFoundException;
import com.ztech.crm.shared.security.TenantContext;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** BE-CUS-01..03. Todo método filtra por el tenant del usuario autenticado (BE-SEC-04). */
@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final ContactRepository contactRepository;
    private final CompanyMapper companyMapper;

    public CompanyService(CompanyRepository companyRepository, ContactRepository contactRepository,
                           CompanyMapper companyMapper) {
        this.companyRepository = companyRepository;
        this.contactRepository = contactRepository;
        this.companyMapper = companyMapper;
    }

    @Transactional
    public CompanyResponse create(CompanyRequest request) {
        Long tenantId = TenantContext.currentTenantId();
        validateCuitUniqueness(tenantId, request.cuit(), null);

        Company company = new Company(tenantId, request.name(), request.status());
        applyRequest(company, request);

        return companyMapper.toResponse(companyRepository.save(company));
    }

    @Transactional
    public CompanyResponse update(Long id, CompanyRequest request) {
        Long tenantId = TenantContext.currentTenantId();
        Company company = getOwnedOrThrow(id, tenantId);
        validateCuitUniqueness(tenantId, request.cuit(), id);

        applyRequest(company, request);

        return companyMapper.toResponse(companyRepository.save(company));
    }

    @Transactional(readOnly = true)
    public CompanyDetailResponse getDetail(Long id) {
        Long tenantId = TenantContext.currentTenantId();
        Company company = getOwnedOrThrow(id, tenantId);
        List<Contact> contacts = contactRepository.findAllByTenantIdAndCompanyId(tenantId, id);
        return companyMapper.toDetailResponse(company, contacts);
    }

    @Transactional(readOnly = true)
    public PageResponse<CompanyResponse> list(Pageable pageable) {
        Long tenantId = TenantContext.currentTenantId();
        Page<Company> page = companyRepository.findAllByTenantId(tenantId, pageable);
        return PageResponse.from(page, companyMapper::toResponse);
    }

    /** Para uso cross-módulo (p. ej. {@code OpportunityService}) — nunca se expone la entidad. */
    @Transactional(readOnly = true)
    public CompanySummaryResponse getSummary(Long id) {
        Long tenantId = TenantContext.currentTenantId();
        Company company = getOwnedOrThrow(id, tenantId);
        return new CompanySummaryResponse(company.getId(), company.getName());
    }

    /** Sólo valida existencia en el tenant — más liviano que {@link #getSummary} cuando no hace falta el DTO. */
    @Transactional(readOnly = true)
    public void assertExists(Long id) {
        getOwnedOrThrow(id, TenantContext.currentTenantId());
    }

    private void applyRequest(Company company, CompanyRequest request) {
        company.updateDetails(request.name(), request.cuit(), request.industry(), request.email(),
                request.phone(), request.address(), request.website(), request.status(),
                request.salesRepId(), request.originId(), request.notes());
    }

    private Company getOwnedOrThrow(Long id, Long tenantId) {
        // 404, nunca 403: no confirma si el id existe en otro tenant (BE-SEC-04).
        return companyRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new NotFoundException("No se encontró la empresa solicitada."));
    }

    private void validateCuitUniqueness(Long tenantId, String cuit, Long excludeId) {
        if (cuit == null || cuit.isBlank()) {
            return;
        }
        boolean exists = excludeId == null
                ? companyRepository.existsByTenantIdAndCuit(tenantId, cuit)
                : companyRepository.existsByTenantIdAndCuitAndIdNot(tenantId, cuit, excludeId);
        if (exists) {
            throw new ConflictException("CUIT_ALREADY_EXISTS", "Ya existe una empresa con ese CUIT.");
        }
    }
}
