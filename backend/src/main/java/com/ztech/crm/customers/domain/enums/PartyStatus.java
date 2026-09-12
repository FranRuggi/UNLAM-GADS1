package com.ztech.crm.customers.domain.enums;

/**
 * Estado de una {@code Company} o {@code Contact}. La baja lógica es un cambio a
 * {@code INACTIVO}/{@code NO_CONTACTAR}, nunca un `DELETE` físico (DT-14).
 */
public enum PartyStatus {
    POTENCIAL,
    CLIENTE,
    INACTIVO,
    NO_CONTACTAR
}
