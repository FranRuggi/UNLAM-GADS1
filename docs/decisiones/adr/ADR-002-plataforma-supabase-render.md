# ADR-002 — Supabase y Render como plataforma, Java 25 y Spring Boot 4

- Estado: Aceptada
- Fecha: 12/09/2026
- Participantes: Nehuen Ascoitia
- Reemplaza: la mención a Neon en `docs/arquitectura/01-arquitectura-general.md`

## Contexto

El documento de arquitectura fijó "PostgreSQL administrado" y sugirió **Neon** para el TP,
con el backend en Render y el frontend en Cloudflare Pages. También fijó "Java y Spring
Boot" sin comprometer versiones.

Al arrancar la implementación hacía falta cerrar proveedor y versiones concretas, porque de
eso dependen la cadena de conexión, el `Dockerfile`, la configuración de Hibernate y el
baseline de Flyway.

## Decisión

- **Base de datos: Supabase** (PostgreSQL administrado), en reemplazo de Neon.
  Se usa **únicamente como PostgreSQL**: la autenticación la resuelve nuestro backend con
  Spring Security y JWT propio. **No se usa Supabase Auth, ni RLS, ni PostgREST, ni el
  cliente de Supabase desde el frontend.** El navegador nunca habla con la base.
- **API: Render**, desplegada como imagen Docker construida desde `backend/Dockerfile`.
- **Runtime: Java 25 (LTS) + Spring Boot 4.x** (Spring Framework 7, Spring Security 7,
  Hibernate 7).
- **Conexión: pooler Supavisor de Supabase en modo *session***.

## Alternativas consideradas

- **Neon**, como decía el documento original. Descartada por preferencia del equipo;
  Supabase da además una consola SQL y un editor de tablas cómodos para la demo.
- **Conexión directa al Postgres de Supabase (puerto 5432 del host propio).** Descartada:
  ese endpoint es IPv6 y la salida a internet de Render no lo resuelve de forma confiable
  sin el add-on de IPv4.
- **Pooler en modo *transaction* (6543).** Escala mejor en cantidad de conexiones, pero
  obliga a desactivar prepared statements en el driver y en Hibernate. Descartada por ser
  una fuente de errores sutiles sin beneficio a la escala de un TP.
- **Deploy nativo en Render sin Docker.** Más simple, pero el documento de arquitectura ya
  fijó Docker como empaquetado y así el build es reproducible localmente.

## Consecuencias

- La cadena de conexión, el secreto del JWT y los orígenes CORS se suministran por
  **variables de entorno**. Ningún secreto se versiona.
- Flyway trabaja sobre el schema `public`. No se tocan los schemas internos de Supabase
  (`auth`, `storage`, `realtime`).
- La restricción de exclusión GiST para reservas requiere
  `CREATE EXTENSION IF NOT EXISTS btree_gist;` en la migración inicial.
- El plan gratuito de Render **duerme el servicio por inactividad**: el primer request
  después de un rato es lento. Hay que despertarlo antes de cada demostración.
- Java 25 y Spring Boot 4 son versiones recientes: si alguna dependencia no acompaña, se
  documenta acá antes de bajar de versión.
