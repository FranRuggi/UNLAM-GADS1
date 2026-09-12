package com.ztech.crm.customers.service;

import com.ztech.crm.customers.domain.Company;
import com.ztech.crm.customers.domain.Contact;
import com.ztech.crm.customers.dto.request.ContactRequest;
import com.ztech.crm.customers.dto.response.ContactDetailResponse;
import com.ztech.crm.customers.dto.response.ContactResponse;
import com.ztech.crm.customers.dto.response.ContactSummaryResponse;
import com.ztech.crm.customers.mapper.ContactMapper;
import com.ztech.crm.customers.repository.CompanyRepository;
import com.ztech.crm.customers.repository.ContactRepository;
import com.ztech.crm.shared.dto.PageResponse;
import com.ztech.crm.shared.exception.ConflictException;
import com.ztech.crm.shared.exception.NotFoundException;
import com.ztech.crm.shared.security.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** BE-CUS-04..07. Todo método filtra por el tenant del usuario autenticado (BE-SEC-04). */
@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final CompanyRepository companyRepository;
    private final ContactMapper contactMapper;

    public ContactService(ContactRepository contactRepository, CompanyRepository companyRepository,
                           ContactMapper contactMapper) {
        this.contactRepository = contactRepository;
        this.companyRepository = companyRepository;
        this.contactMapper = contactMapper;
    }

    @Transactional
    public ContactResponse create(ContactRequest request) {
        Long tenantId = TenantContext.currentTenantId();
        validateDocumentUniqueness(tenantId, request.document(), null);
        Company company = resolveCompany(tenantId, request.companyId());

        Contact contact = new Contact(tenantId, request.firstName(), request.lastName(), request.status());
        applyRequest(contact, company, request);

        return contactMapper.toResponse(contactRepository.save(contact));
    }

    @Transactional
    public ContactResponse update(Long id, ContactRequest request) {
        Long tenantId = TenantContext.currentTenantId();
        Contact contact = getOwnedOrThrow(id, tenantId);
        validateDocumentUniqueness(tenantId, request.document(), id);
        Company company = resolveCompany(tenantId, request.companyId());

        applyRequest(contact, company, request);

        return contactMapper.toResponse(contactRepository.save(contact));
    }

    @Transactional(readOnly = true)
    public ContactDetailResponse getDetail(Long id) {
        Long tenantId = TenantContext.currentTenantId();
        return contactMapper.toDetailResponse(getOwnedOrThrow(id, tenantId));
    }

    @Transactional(readOnly = true)
    public PageResponse<ContactResponse> list(Pageable pageable) {
        Long tenantId = TenantContext.currentTenantId();
        Page<Contact> page = contactRepository.findAllByTenantId(tenantId, pageable);
        return PageResponse.from(page, contactMapper::toResponse);
    }

    /** Para uso cross-módulo (p. ej. {@code OpportunityService}) — nunca se expone la entidad. */
    @Transactional(readOnly = true)
    public ContactSummaryResponse getSummary(Long id) {
        Long tenantId = TenantContext.currentTenantId();
        Contact contact = getOwnedOrThrow(id, tenantId);
        return new ContactSummaryResponse(contact.getId(), contact.getFirstName(), contact.getLastName(),
                contact.getEmail(), contact.getStatus());
    }

    /** Sólo valida existencia en el tenant — más liviano que {@link #getSummary} cuando no hace falta el DTO. */
    @Transactional(readOnly = true)
    public void assertExists(Long id) {
        getOwnedOrThrow(id, TenantContext.currentTenantId());
    }

    private void applyRequest(Contact contact, Company company, ContactRequest request) {
        contact.updateDetails(company, request.firstName(), request.lastName(), request.document(),
                request.position(), request.email(), request.phone(), request.status(),
                request.salesRepId(), request.originId(), request.notes());
    }

    private Contact getOwnedOrThrow(Long id, Long tenantId) {
        return contactRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new NotFoundException("No se encontró el contacto solicitado."));
    }

    private Company resolveCompany(Long tenantId, Long companyId) {
        if (companyId == null) {
            return null; // cliente individual (Módulo 1 de la consigna)
        }
        return companyRepository.findByIdAndTenantId(companyId, tenantId)
                .orElseThrow(() -> new NotFoundException("COMPANY_NOT_FOUND", "La empresa relacionada no existe."));
    }

    private void validateDocumentUniqueness(Long tenantId, String document, Long excludeId) {
        if (document == null || document.isBlank()) {
            return;
        }
        boolean exists = excludeId == null
                ? contactRepository.existsByTenantIdAndDocument(tenantId, document)
                : contactRepository.existsByTenantIdAndDocumentAndIdNot(tenantId, document, excludeId);
        if (exists) {
            throw new ConflictException("DOCUMENT_ALREADY_EXISTS", "Ya existe un contacto con ese documento.");
        }
    }
}
