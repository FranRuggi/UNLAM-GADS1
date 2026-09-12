package com.ztech.crm.catalogs.service;

import com.ztech.crm.catalogs.domain.Stage;
import com.ztech.crm.catalogs.domain.enums.StageKind;
import com.ztech.crm.catalogs.dto.response.StageResponse;
import com.ztech.crm.catalogs.mapper.StageMapper;
import com.ztech.crm.catalogs.repository.StageRepository;
import com.ztech.crm.shared.exception.BusinessException;
import com.ztech.crm.shared.exception.NotFoundException;
import com.ztech.crm.shared.security.TenantContext;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** BE-CAT-01. Sólo lectura en E1; el ABM llega en la Fase 6 (BE-CAT-02). */
@Service
public class StageService {

    private final StageRepository stageRepository;
    private final StageMapper stageMapper;

    public StageService(StageRepository stageRepository, StageMapper stageMapper) {
        this.stageRepository = stageRepository;
        this.stageMapper = stageMapper;
    }

    @Transactional(readOnly = true)
    public List<StageResponse> list() {
        Long tenantId = TenantContext.currentTenantId();
        return stageRepository.findAllByTenantIdOrderByPosition(tenantId).stream().map(stageMapper::toResponse).toList();
    }

    /** Para mostrar la etapa actual de una oportunidad — cualquier etapa, no sólo abiertas. */
    @Transactional(readOnly = true)
    public StageResponse getSummary(Long id) {
        return stageMapper.toResponse(getOwnedOrThrow(id));
    }

    /**
     * Para {@code OpportunityService} al crear una oportunidad: una oportunidad
     * abierta sólo puede empezar en una etapa {@code OPEN} activa (regla de la
     * consigna: "una oportunidad abierta no podrá estar en una etapa ganada o
     * perdida").
     */
    @Transactional(readOnly = true)
    public StageResponse assertOpenAndActive(Long id) {
        Stage stage = getOwnedOrThrow(id);
        if (!stage.isActive()) {
            throw new BusinessException("STAGE_INACTIVE", "La etapa seleccionada no está activa.");
        }
        if (stage.getKind() != StageKind.OPEN) {
            throw new BusinessException("STAGE_NOT_OPEN", "Una oportunidad sólo puede crearse en una etapa abierta.");
        }
        return stageMapper.toResponse(stage);
    }

    private Stage getOwnedOrThrow(Long id) {
        Long tenantId = TenantContext.currentTenantId();
        return stageRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new NotFoundException("No se encontró la etapa solicitada."));
    }
}
