package com.ztech.crm.catalogs.repository;

import com.ztech.crm.catalogs.domain.Stage;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StageRepository extends JpaRepository<Stage, Long> {

    Optional<Stage> findByIdAndTenantId(Long id, Long tenantId);

    List<Stage> findAllByTenantIdOrderByPosition(Long tenantId);
}
