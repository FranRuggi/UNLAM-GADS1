package com.ztech.crm.opportunities.repository;

import com.ztech.crm.opportunities.domain.Opportunity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    Optional<Opportunity> findByIdAndTenantId(Long id, Long tenantId);

    Page<Opportunity> findAllByTenantId(Long tenantId, Pageable pageable);

    /** Sin paginar — para el tablero (BE-OPP-06), que necesita todo de una vez. */
    List<Opportunity> findAllByTenantId(Long tenantId);
}
