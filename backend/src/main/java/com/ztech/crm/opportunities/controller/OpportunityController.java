package com.ztech.crm.opportunities.controller;

import com.ztech.crm.opportunities.dto.request.ChangeStageRequest;
import com.ztech.crm.opportunities.dto.request.CreateOpportunityRequest;
import com.ztech.crm.opportunities.dto.request.UpdateOpportunityRequest;
import com.ztech.crm.opportunities.dto.response.OpportunityBoardResponse;
import com.ztech.crm.opportunities.dto.response.OpportunityDetailResponse;
import com.ztech.crm.opportunities.dto.response.OpportunityResponse;
import com.ztech.crm.opportunities.service.ChangeStageService;
import com.ztech.crm.opportunities.service.OpportunityService;
import com.ztech.crm.shared.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/v1/opportunities")
@Tag(name = "Opportunities", description = "Gestión de oportunidades (BE-OPP-01..03/05/06)")
public class OpportunityController {

    private final OpportunityService opportunityService;
    private final ChangeStageService changeStageService;

    public OpportunityController(OpportunityService opportunityService, ChangeStageService changeStageService) {
        this.opportunityService = opportunityService;
        this.changeStageService = changeStageService;
    }

    @PostMapping
    @Operation(summary = "Crea una oportunidad")
    @ApiResponse(responseCode = "201", description = "Oportunidad creada")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @ApiResponse(responseCode = "404", description = "La empresa, el contacto, el salón o la etapa relacionados no existen")
    @ApiResponse(responseCode = "422", description = "Falta empresa/contacto, o la etapa inicial no está abierta")
    public ResponseEntity<OpportunityResponse> create(@Valid @RequestBody CreateOpportunityRequest request,
                                                        UriComponentsBuilder uriBuilder) {
        OpportunityResponse response = opportunityService.create(request);
        URI location = uriBuilder.path("/api/v1/opportunities/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edita una oportunidad abierta (no cambia etapa, responsable ni estado)")
    @ApiResponse(responseCode = "200", description = "Oportunidad actualizada")
    @ApiResponse(responseCode = "404", description = "No existe una oportunidad con ese id")
    @ApiResponse(responseCode = "409", description = "La oportunidad está cerrada")
    public ResponseEntity<OpportunityResponse> update(@PathVariable Long id,
                                                        @Valid @RequestBody UpdateOpportunityRequest request) {
        return ResponseEntity.ok(opportunityService.update(id, request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de una oportunidad, con cliente, salón y etapa resueltos (BE-OPP-03)")
    @ApiResponse(responseCode = "200", description = "OK")
    @ApiResponse(responseCode = "404", description = "No existe una oportunidad con ese id")
    public ResponseEntity<OpportunityDetailResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(opportunityService.getDetail(id));
    }

    @GetMapping
    @Operation(summary = "Lista oportunidades del tenant, paginado")
    public ResponseEntity<PageResponse<OpportunityResponse>> list(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(opportunityService.list(pageable));
    }

    @GetMapping("/board")
    @Operation(summary = "Oportunidades agrupadas por etapa, una columna por etapa (BE-OPP-06)")
    public ResponseEntity<OpportunityBoardResponse> board() {
        return ResponseEntity.ok(opportunityService.getBoard());
    }

    @PostMapping("/{id}/stage")
    @Operation(summary = "Cambia la etapa de una oportunidad abierta y registra el historial (BE-OPP-05)")
    @ApiResponse(responseCode = "200", description = "Etapa cambiada")
    @ApiResponse(responseCode = "404", description = "No existe la oportunidad o la etapa destino")
    @ApiResponse(responseCode = "409", description = "La oportunidad está cerrada")
    @ApiResponse(responseCode = "422", description = "Misma etapa, o etapa destino no abierta (usar /win o /lose)")
    public ResponseEntity<OpportunityResponse> changeStage(@PathVariable Long id,
                                                            @Valid @RequestBody ChangeStageRequest request) {
        return ResponseEntity.ok(changeStageService.changeStage(id, request));
    }
}
