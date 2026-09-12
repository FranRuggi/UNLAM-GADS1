package com.ztech.crm.shared.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Valida sólo la <b>estructura</b> del CUIT (11 dígitos, con o sin guiones). El dígito
 * verificador queda pendiente de DP-03 ("si el CUIT se valida con dígito verificador"
 * sigue sin resolución) — no se implementa por adelantado.
 */
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CuitValidator.class)
public @interface ValidCuit {

    String message() default "El CUIT debe tener 11 dígitos, con o sin guiones (XX-XXXXXXXX-X).";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
