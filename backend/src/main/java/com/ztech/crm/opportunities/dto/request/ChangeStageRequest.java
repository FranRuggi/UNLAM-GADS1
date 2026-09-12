package com.ztech.crm.opportunities.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/**
 * BE-OPP-05. Sólo mueve entre etapas {@code OPEN} — pasar a una etapa {@code WON}/
 * {@code LOST} se hace con {@code /win}/{@code /lose} (Fase 7), no acá.
 */
public record ChangeStageRequest(

        @Schema(description = "Etapa destino — debe ser una etapa abierta")
        @NotNull(message = "La etapa destino es obligatoria.")
        Long stageId,

        @Schema(description = "Observación opcional sobre el cambio")
        String note
) {
}
