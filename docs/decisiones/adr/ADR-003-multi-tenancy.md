# ADR-003 — Mantener multi-tenancy pese a estar fuera del alcance de la consigna

- Estado: Aceptada
- Fecha: 12/09/2026
- Participantes: Nehuen Ascoitia

## Contexto

Hay una contradicción entre las dos fuentes del proyecto:

- `docs/consignas/Consigna_Trabajo_Practico.pdf` lista, en la tabla de alcance,
  **"Soporte para múltiples organizaciones" como fuera del alcance**.
- `docs/arquitectura/03-datos-seguridad-y-concurrencia.md` define multi-tenancy con
  Shared Database + Shared Schema, `tenant_id` en toda entidad y filtrado obligatorio en
  cada consulta.

Según la regla de precedencia de `docs/README.md`, la consigna gobierna el alcance del
producto. Implementarlo no suma puntos de evaluación y cuesta trabajo en cada corte
vertical: una columna más por tabla, índices compuestos, un filtro por consulta,
resolución del tenant en el token y una batería de tests de acceso cruzado.

## Decisión

**Se mantiene la multi-tenancy completa**, tal como la definió el documento de
arquitectura, asumiendo explícitamente que es trabajo por encima de lo que la consigna
exige. Se prioriza la coherencia con la arquitectura aprobada.

Implicancias concretas:

1. Toda tabla de negocio lleva `tenant_id NOT NULL` con FK a `tenants`.
2. El `tenantId` se obtiene del **JWT del usuario autenticado**, nunca de un parámetro del
   request. Se expone por `TenantContext` en `shared/security/`.
3. Todo acceso filtra por tenant: `findByIdAndTenantId`, `findAllByTenantId`. No existe un
   `findById` desnudo en un repositorio de negocio.
4. Las claves únicas locales a una organización incluyen `tenant_id`:
   `UNIQUE (tenant_id, cuit)`, no `UNIQUE (cuit)`.
5. Hay tests negativos obligatorios de acceso cruzado, **tanto por listado como por id
   directo**.
6. No hay endpoint de alta de organizaciones. El tenant inicial y su usuario `ADMIN` se
   crean por migración Flyway.

## Alternativas consideradas

- **Eliminarla.** Alineada con la consigna y bastante menos código. Descartada por
  decisión del equipo: se prefiere sostener el documento de arquitectura.
- **Dejar la columna preparada sin activar el filtrado.** Costo casi nulo hoy. Descartada
  porque una multi-tenancy a medias es peor que ninguna: da una falsa sensación de
  aislamiento y el día que se active hay que auditar cada consulta ya escrita.

## Consecuencias

- Cada corte vertical incluye, sin excepción, el filtrado por tenant y su test negativo.
  Un endpoint sin filtro de tenant es un defecto, no una omisión menor.
- Si el tiempo aprieta cerca de una entrega, **esto no es lo que se recorta**: recortarlo a
  mitad de camino deja el sistema en el estado inconsistente que la alternativa descartada
  buscaba evitar.
- El JWT transporta `tenantId`, por lo que un cambio de tenant obliga a re-emitir el token.
