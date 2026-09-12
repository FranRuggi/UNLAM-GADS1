package com.ztech.crm.offerings.controller;

import com.ztech.crm.offerings.dto.response.EventServiceResponse;
import com.ztech.crm.offerings.service.EventServiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Sólo lectura en E1 (BE-OFF-03); el ABM llega en la Fase 6. */
@RestController
@RequestMapping("/api/v1/event-services")
@Tag(name = "EventServices", description = "Servicios adicionales (BE-OFF-03)")
public class EventServiceController {

    private final EventServiceService eventServiceService;

    public EventServiceController(EventServiceService eventServiceService) {
        this.eventServiceService = eventServiceService;
    }

    @GetMapping
    @Operation(summary = "Lista los servicios adicionales del tenant")
    public ResponseEntity<List<EventServiceResponse>> list() {
        return ResponseEntity.ok(eventServiceService.list());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de un servicio adicional")
    @ApiResponse(responseCode = "200", description = "OK")
    @ApiResponse(responseCode = "404", description = "No existe un servicio con ese id")
    public ResponseEntity<EventServiceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(eventServiceService.getDetail(id));
    }
}
