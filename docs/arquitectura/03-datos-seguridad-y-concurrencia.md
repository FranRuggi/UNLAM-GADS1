# Datos, seguridad y concurrencia

## Multi-tenancy

El modelo utiliza **Shared Database + Shared Schema**. Toda entidad perteneciente a una organización incluye `tenant_id`. El tenant se obtiene del usuario autenticado; el backend no confía en un `tenant_id` enviado libremente por el cliente.

Toda lectura o escritura se restringe por identificador y tenant, por ejemplo `findByIdAndTenantId`. Índices, claves únicas y restricciones de negocio deben incluir `tenant_id` cuando su unicidad sea local a una organización. Los tests deben intentar accesos cruzados tanto por listado como por identificador directo.

## Autenticación y autorización

Spring Security protege la API mediante JWT. La autorización combina dos controles:

1. **Rol:** `ADMIN`, `SELLER` o `SALES_MANAGER`.
2. **Alcance:** un vendedor solo accede a empresas, contactos y oportunidades permitidos por su asignación.

Ocultar acciones en React no constituye seguridad. Cada endpoint y consulta protegida valida rol, tenant y alcance. Las contraseñas se guardan con un `PasswordEncoder` seguro con salt; nunca en texto plano ni mediante cifrado reversible.

## Persistencia y evolución

Flyway es la única fuente de evolución del esquema. `ddl-auto=update` no se utiliza en producción. Toda migración aplicada es inmutable: una corrección se publica como una nueva versión y debe ejecutarse desde una base vacía en CI.

Los registros con historia comercial usan baja lógica mediante `active` o `deleted_at`. Una baja no rompe referencias existentes. `StageHistory` es append-only: se permite insertar, pero no editar ni eliminar.

## Transacciones y auditoría

Los casos de uso críticos se ejecutan dentro de transacciones Spring. Un cambio de etapa actualiza `Opportunity` y agrega `StageHistory` en la misma transacción; si una operación falla, ninguna modificación persiste.

El servidor asigna autor y fecha de auditoría desde el contexto autenticado y su reloj. Los cambios importantes conservan, como mínimo, usuario, instante y entidad afectada. La política exacta para fecha efectiva de actividades y reapertura de oportunidades continúa pendiente.

## Reservas concurrentes

Solo una oportunidad ganada bloquea el salón. La protección tiene dos niveles:

- El backend consulta disponibilidad para ofrecer un error comprensible.
- PostgreSQL impide físicamente dos rangos superpuestos para el mismo `tenant_id` y salón, incluso si llegan solicitudes simultáneas.

La implementación prevista es una restricción de exclusión GiST sobre tenant, salón y rango temporal, filtrada por estado ganado. Su forma exacta depende de resolver extremos contiguos, zona horaria, eventos que cruzan medianoche y reaperturas (DP-07). El backend traduce la violación a `409 Conflict`.

`Opportunity` puede incorporar `@Version` para optimistic locking y rechazar actualizaciones basadas en datos obsoletos. Las pruebas con Testcontainers deben cubrir dos confirmaciones simultáneas: exactamente una puede finalizar con éxito.

## Controles mínimos verificables

- Un JWT válido no habilita datos de otro tenant.
- Un `SELLER` no accede a registros fuera de su asignación.
- Ningún cambio de etapa queda sin historial ni historial sin cambio.
- Las bajas conservan relaciones históricas.
- Una confirmación rechaza exceso de capacidad y superposición.
- Logs y respuestas no exponen contraseñas, tokens ni datos de otro tenant.
