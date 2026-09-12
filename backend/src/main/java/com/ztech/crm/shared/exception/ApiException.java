package com.ztech.crm.shared.exception;

import org.springframework.http.HttpStatus;

/**
 * Base de las excepciones de negocio que {@link GlobalExceptionHandler} traduce a una
 * respuesta HTTP consistente (design.md §7). {@code code} es un identificador estable
 * para el cliente (p. ej. {@code VENUE_ALREADY_BOOKED}), independiente del mensaje en
 * español que ve el usuario.
 */
public abstract class ApiException extends RuntimeException {

    private final String code;

    protected ApiException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public abstract HttpStatus getStatus();
}
