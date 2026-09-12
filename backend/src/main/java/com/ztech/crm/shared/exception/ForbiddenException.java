package com.ztech.crm.shared.exception;

import org.springframework.http.HttpStatus;

/** Rol o alcance insuficiente para la operación (BE-SEC-05/06). */
public class ForbiddenException extends ApiException {

    public ForbiddenException(String message) {
        this("FORBIDDEN", message);
    }

    public ForbiddenException(String code, String message) {
        super(code, message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.FORBIDDEN;
    }
}
