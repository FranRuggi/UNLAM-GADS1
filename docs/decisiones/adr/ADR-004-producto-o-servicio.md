# ADR-004 — Modelado de "producto o servicio": Venue y EventService

- Estado: Aceptada
- Fecha: 12/09/2026
- Participantes: Nehuen Ascoitia
- Amplía: el módulo `venues` de `docs/arquitectura/02-modulos-y-capas.md`

## Contexto

La consigna exige un módulo de **"Gestión de productos o servicios"**: aparece en el punto 6
del orden obligatorio de desarrollo, en la lista de funcionalidades de la entrega final, en
las pantallas mínimas ("Listado de productos o servicios") y en E1 al menos precargado.
`Definiciones-Generales.pdf` lo define como "aquello que la organización ofrece
comercialmente" y aclara que puede aparecer en distintas oportunidades.

El documento de arquitectura, en cambio, sólo modeló `Venue` (salón, con capacidad, tarifa
y estado) dentro de un módulo `venues`. No hay una entidad que cubra explícitamente el
concepto de producto o servicio.

## Decisión

Un módulo **`offerings`** ("lo que ofrecemos comercialmente"), con dos entidades separadas:

- **`Venue`** — el salón. Tiene capacidad, tarifa y estado. Es lo que se **reserva**: sobre
  él operan la validación de capacidad y la restricción de solapamiento de fechas.
- **`EventService`** — servicios adicionales: catering, audio, decoración, mobiliario.
  Ítem con precio y estado. **No se reserva** ni tiene capacidad.

Una oportunidad toma **un salón** (FK `venue_id`, ver DP-09) y, después de E1, opcionalmente
varios `EventService`.

El módulo se llama `offerings` y no `services` deliberadamente: `com.ztech.crm.services.service.ServiceService`
sería ilegible, y "offerings" agrupa bien las dos entidades bajo el concepto que pide la consigna.

## Alternativas consideradas

- **El salón es el producto (sólo `Venue`).** Lo más simple y suficiente para la demo de E1.
  Descartada porque un evaluador que busque el módulo de productos/servicios de la consigna
  podría no darlo por cumplido, y porque los servicios adicionales son parte real del
  negocio de un salón.
- **Una tabla `Product` genérica con un campo `type` (`SALON` / `SERVICIO`).** Una sola
  tabla. Descartada porque mezcla dos cosas con reglas distintas: `capacity` y la reserva
  aplican a una sola de las dos, lo que obliga a columnas nullables y a validaciones
  condicionales por tipo.

## Consecuencias

- El módulo `venues` del documento de arquitectura pasa a llamarse `offerings` y contiene
  las dos entidades.
- En E1 ambas entidades están **precargadas por migración**, como permite la consigna; su
  ABM completo llega para la entrega final.
- La relación oportunidad ↔ servicios adicionales es N:N con tabla intermedia, y queda
  fuera de E1. Al agregarla habrá que decidir si guarda precio al momento de la venta.
- La capacidad y la reserva viven en `Venue`; `EventService` no participa de la restricción
  de exclusión GiST.
