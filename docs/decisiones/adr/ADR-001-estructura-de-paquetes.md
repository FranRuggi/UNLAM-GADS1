# ADR-001 — Estructura de paquetes del backend

- Estado: Aceptada
- Fecha: 12/09/2026
- Participantes: Nehuen Ascoitia
- Reemplaza: la sección "Capas internas" de `docs/arquitectura/02-modulos-y-capas.md`

## Contexto

`docs/arquitectura/02-modulos-y-capas.md` definió un monolito modular con módulos por
capacidad de negocio y, dentro de cada uno, las capas `api/`, `application/`, `domain/`,
`infrastructure/` y `web/`. Esa nomenclatura viene de arquitectura hexagonal y no es la
que el equipo usa ni la que espera encontrar al abrir el proyecto: los nombres habituales
en un proyecto Spring son `controller`, `service`, `repository` y `dto`.

Al mismo tiempo, aplanar todo por capa al primer nivel (`com.ztech.crm.controller.*`,
`com.ztech.crm.service.*`) haría desaparecer los límites entre módulos que el documento de
arquitectura definió deliberadamente, y con ellos la posibilidad de detectar una
dependencia indebida simplemente mirando un `import`.

## Decisión

**Módulo de negocio al primer nivel, capas adentro**, con nomenclatura Spring:

```text
com.ztech.crm.<modulo>.{controller,service,domain,dto,repository,mapper}
```

Módulos: `tenancy`, `access`, `customers`, `offerings`, `catalogs`, `opportunities`,
`activities`. Lo transversal vive en `com.ztech.crm.shared.{config,security,exception,validation,audit,dto}`.

Se elimina el paquete `api/` por módulo que proponía el documento original. Su función —
definir qué parte de un módulo es consumible desde afuera — se reemplaza por una regla:

> **Un módulo consume únicamente el `service` de otro módulo.** Nunca su `repository`,
> su `domain` ni sus DTOs internos.

La dirección de dependencias permitida no cambia respecto del documento de arquitectura:
`activities → opportunities → {customers, offerings, catalogs} → access → tenancy`.
Sin ciclos.

## Alternativas consideradas

- **Mantener `api/application/domain/infrastructure/web`.** Más fiel al documento aprobado
  y con el contrato entre módulos explícito en el árbol de archivos. Descartada porque el
  equipo trabaja con nomenclatura Spring y la traducción mental constante es un costo real
  durante un TP con fechas ajustadas.
- **Aplanar por capa al primer nivel.** Lo más simple de navegar con ~8 entidades.
  Descartada porque borra los límites modulares y hace que una violación de dependencia sea
  invisible en el código.

## Consecuencias

- El contrato entre módulos pasa a ser una convención documentada en vez de una barrera
  visible en el árbol de paquetes. Se depende de la revisión en PR para sostenerlo.
- Un `service` que necesita datos de otro módulo llama al `service` dueño, lo que puede
  producir más saltos que un `join` directo. Es el costo aceptado por mantener los límites.
- `docs/arquitectura/02-modulos-y-capas.md` queda actualizado para reflejar esta estructura.
