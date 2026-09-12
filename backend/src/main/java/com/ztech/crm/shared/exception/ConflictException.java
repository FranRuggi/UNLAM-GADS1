package com.ztech.crm.shared.exception;

import org.springframework.http.HttpStatus;

/** Transición inválida, unicidad violada o reserva superpuesta (design.md §9.3). */
public class ConflictException extends ApiException {

    public ConflictException(String message) {
        this("CONFLICT", message);
    }

    public ConflictException(String code, String message) {
        super(code, message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.CONFLICT;
    }
}
