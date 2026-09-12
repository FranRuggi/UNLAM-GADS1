package com.ztech.crm.offerings.repository;

import com.ztech.crm.offerings.domain.Venue;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue, Long> {

    Optional<Venue> findByIdAndTenantId(Long id, Long tenantId);

    List<Venue> findAllByTenantIdOrderByName(Long tenantId);
}
