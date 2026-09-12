package com.ztech.crm.shared.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class CuitValidator implements ConstraintValidator<ValidCuit, String> {

    private static final Pattern CUIT_PATTERN = Pattern.compile("^\\d{2}-?\\d{8}-?\\d{1}$");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            // El campo es opcional (DP-03); @NotBlank se ocuparía de la obligatoriedad
            // si en algún punto pasara a serlo.
            return true;
        }
        return CUIT_PATTERN.matcher(value).matches();
    }
}
