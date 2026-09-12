package com.ztech.crm.shared.exception;

import org.springframework.http.HttpStatus;

/** El recurso no existe, o existe en otro tenant — ambos casos responden 404 (BE-SEC-04). */
public class NotFoundException extends ApiException {

    public NotFoundException(String message) {
        this("NOT_FOUND", message);
    }

    public NotFoundException(String code, String message) {
        super(code, message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.NOT_FOUND;
    }
}
