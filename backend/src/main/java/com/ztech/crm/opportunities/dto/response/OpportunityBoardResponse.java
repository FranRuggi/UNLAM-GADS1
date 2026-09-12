package com.ztech.crm.opportunities.dto.response;

import java.util.List;

/** BE-OPP-06: oportunidades agrupadas por etapa, una columna por etapa (incluidas WON/LOST). */
public record OpportunityBoardResponse(List<StageColumn> columns) {

    public record StageColumn(Long stageId, String stageName, List<OpportunityResponse> opportunities) {
    }
}
