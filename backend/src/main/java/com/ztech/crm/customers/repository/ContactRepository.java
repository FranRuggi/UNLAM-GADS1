package com.ztech.crm.customers.repository;

import com.ztech.crm.customers.domain.Contact;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    Optional<Contact> findByIdAndTenantId(Long id, Long tenantId);

    Page<Contact> findAllByTenantId(Long tenantId, Pageable pageable);

    List<Contact> findAllByTenantIdAndCompanyId(Long tenantId, Long companyId);

    boolean existsByTenantIdAndDocument(Long tenantId, String document);

    boolean existsByTenantIdAndDocumentAndIdNot(Long tenantId, String document, Long id);
}
