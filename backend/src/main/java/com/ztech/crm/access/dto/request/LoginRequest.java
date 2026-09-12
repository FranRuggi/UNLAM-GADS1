package com.ztech.crm.access.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        @Schema(description = "Email del usuario", example = "admin@ztech.local")
        @NotBlank(message = "El email es obligatorio.")
        @Email(message = "El email no tiene un formato válido.")
        String email,

        @Schema(description = "Contraseña en texto plano, sólo para este request", example = "Admin123!")
        @NotBlank(message = "La contraseña es obligatoria.")
        String password
) {
}
