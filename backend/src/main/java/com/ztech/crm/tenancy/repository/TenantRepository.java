package com.ztech.crm.tenancy.repository;

import com.ztech.crm.tenancy.domain.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
}
