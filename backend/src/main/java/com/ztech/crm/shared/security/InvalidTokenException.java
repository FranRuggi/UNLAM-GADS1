package com.ztech.crm.shared.security;

import org.springframework.security.core.AuthenticationException;

/** Token ausente, mal formado, vencido o con firma inválida. */
public class InvalidTokenException extends AuthenticationException {

    public InvalidTokenException(String message) {
        super(message);
    }
}
