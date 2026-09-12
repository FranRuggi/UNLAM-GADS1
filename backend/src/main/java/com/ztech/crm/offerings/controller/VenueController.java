package com.ztech.crm.offerings.controller;

import com.ztech.crm.offerings.dto.response.VenueResponse;
import com.ztech.crm.offerings.service.VenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Sólo lectura en E1 (BE-OFF-01); el ABM llega en la Fase 6. */
@RestController
@RequestMapping("/api/v1/venues")
@Tag(name = "Venues", description = "Salones (BE-OFF-01)")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @GetMapping
    @Operation(summary = "Lista los salones del tenant")
    public ResponseEntity<List<VenueResponse>> list() {
        return ResponseEntity.ok(venueService.list());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de un salón")
    @ApiResponse(responseCode = "200", description = "OK")
    @ApiResponse(responseCode = "404", description = "No existe un salón con ese id")
    public ResponseEntity<VenueResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(venueService.getDetail(id));
    }
}
