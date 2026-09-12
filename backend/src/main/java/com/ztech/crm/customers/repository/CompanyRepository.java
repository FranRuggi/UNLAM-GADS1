package com.ztech.crm.customers.repository;

import com.ztech.crm.customers.domain.Company;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByIdAndTenantId(Long id, Long tenantId);

    Page<Company> findAllByTenantId(Long tenantId, Pageable pageable);

    boolean existsByTenantIdAndCuit(Long tenantId, String cuit);

    boolean existsByTenantIdAndCuitAndIdNot(Long tenantId, String cuit, Long id);
}
