package com.ztech.crm.catalogs.controller;

import com.ztech.crm.catalogs.dto.response.StageResponse;
import com.ztech.crm.catalogs.service.StageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Sólo lectura en E1 (BE-CAT-01); el ABM llega en la Fase 6. */
@RestController
@RequestMapping("/api/v1/stages")
@Tag(name = "Stages", description = "Etapas del embudo comercial (BE-CAT-01, DP-06)")
public class StageController {

    private final StageService stageService;

    public StageController(StageService stageService) {
        this.stageService = stageService;
    }

    @GetMapping
    @Operation(summary = "Lista las etapas del tenant, ordenadas por posición")
    public ResponseEntity<List<StageResponse>> list() {
        return ResponseEntity.ok(stageService.list());
    }
}
