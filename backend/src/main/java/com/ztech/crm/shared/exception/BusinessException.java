package com.ztech.crm.shared.exception;

import org.springframework.http.HttpStatus;

/** Regla de negocio incumplida que no es un conflicto de concurrencia (p. ej. capacidad excedida). */
public class BusinessException extends ApiException {

    public BusinessException(String message) {
        this("BUSINESS_RULE_VIOLATION", message);
    }

    public BusinessException(String code, String message) {
        super(code, message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.UNPROCESSABLE_CONTENT;
    }
}
