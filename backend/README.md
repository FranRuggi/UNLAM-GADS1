# zTech CRM — Backend

API del CRM de salones de eventos corporativos (UNLaM GADS1). Este README refleja el
estado del backend a la **Entrega 1** (24/09/2026): login, empresas y contactos,
salones/servicios/etapas precargados, oportunidades y embudo con cambio de etapa
persistido. Se actualiza en cada entrega — ver la sección [Estado](#estado-y-alcance)
al final para el detalle de qué está implementado y qué no.

Contexto funcional y arquitectónico completo: [`docs/`](../docs/README.md) en la raíz
del repositorio. Decisiones técnicas del backend: [`docs/context/`](../docs/context/)
y [`docs/specs-backend/`](../docs/specs-backend/), compartidas por todos los asistentes.

## Stack

| Área | Tecnología |
|---|---|
| Lenguaje | Java 25 (LTS) |
| Framework | Spring Boot 4.1.1 (Spring Framework 7, Spring Security 7, Hibernate 7) |
| Persistencia | PostgreSQL (Supabase) + Spring Data JPA + Flyway |
| Seguridad | Spring Security + JWT propio (HS512) |
| Build | Maven (con wrapper — no hace falta tener Maven instalado) |
| Documentación de API | springdoc-openapi 3.1.1 (Swagger UI + OpenAPI 3.1) |
| Tests | JUnit 5, Mockito, Testcontainers |

## Requisitos previos

- **JDK 25**, y tiene que ser el que se usa en la terminal — ver la nota de abajo si
  hay más de un JDK instalado. El proyecto usa el wrapper de Maven (`./mvnw`), así que
  no hace falta instalar Maven aparte.
  - Windows: `winget install --id EclipseAdoptium.Temurin.25.JDK -e`
  - Mac/Linux: [adoptium.net](https://adoptium.net/) o el gestor de paquetes del sistema.
  - Verificar: `java -version` tiene que mostrar `"25...`.
- **Docker Desktop instalado y corriendo** (no alcanza con tenerlo instalado nada más).
  Hace falta para los tests de integración (Testcontainers levanta su propio PostgreSQL
  efímero) y, opcionalmente, para correr la app con `docker compose`.
- Acceso a un proyecto de **Supabase** (PostgreSQL administrado). No se usa Supabase
  Auth ni RLS — sólo la base de datos. Sin credenciales propias, pedirle al equipo el
  connection string del proyecto compartido.

> ⚠️ **Si tenés más de un JDK instalado** (muy común), `java -version` y `./mvnw` pueden
> estar usando uno viejo sin que sea obvio. Sintoma típico:
> `UnsupportedClassVersionError: ... class file version 69.0 ... only recognizes ... up
> to 61.0`. Solución: setear `JAVA_HOME` apuntando al JDK 25 antes de correr nada —
> `run.ps1`/`run.sh` (ver abajo) lo detectan y avisan en vez de fallar con ese error
> críptico.

## Variables de entorno

Copiar [`.env.example`](.env.example) a `.env` y completar. **Nunca commitear `.env`**
(ya está en `.gitignore`).

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DB_URL` | Sí | JDBC URL de PostgreSQL. Ver la nota de conexión más abajo. |
| `DB_USERNAME` | Sí | Usuario de conexión (formato distinto según directo vs. pooler). |
| `DB_PASSWORD` | Sí | Password de la base. |
| `DB_POOL_SIZE` | No (default 10) | Tamaño del pool de Hikari. |
| `JWT_SECRET` | Sí | Secreto para firmar los JWT. Generar uno largo y aleatorio, p. ej. `openssl rand -base64 48`. |
| `JWT_EXPIRATION_MINUTES` | No (default 480) | Vigencia del access token, en minutos. |
| `CORS_ALLOWED_ORIGINS` | No (default `http://localhost:5173`) | Orígenes permitidos, separados por coma. |
| `PORT` | No (default 8080) | Puerto HTTP. Render lo inyecta automáticamente en producción. |

### Conexión a Supabase: directa vs. pooler

- **Local, sin Docker** (`./mvnw spring-boot:run`): la conexión **directa** funciona si
  tu red tiene IPv6 real (verificado el 12/09/2026 desde una conexión hogareña
  argentina). Formato: `jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require`,
  usuario `postgres`.
- **Local, con Docker Compose** o **en Render**: usar el **pooler Supavisor en modo
  session** — Docker Desktop y Render no tienen salida IPv6. Se obtiene en el dashboard
  de Supabase: *Settings → Database → Connection pooling → Session mode*. Formato:
  `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:5432/postgres`, usuario
  `postgres.<project-ref>`.

Ver también [`docs/docker.md`](docs/docker.md) y
[ADR-002](../docs/decisiones/adr/ADR-002-plataforma-supabase-render.md).

## Cómo levantar en local

### Sin Docker

```powershell
# Windows
.\run.ps1
```
```bash
# Mac/Linux/Git Bash
./run.sh
```

`run.ps1`/`run.sh` hacen tres cosas antes de arrancar: **(1)** verifican que el JDK
activo sea la versión 25 y cortan con un mensaje claro si no — no el
`UnsupportedClassVersionError` críptico; **(2)** cargan `backend/.env` al proceso —
**esto es necesario**: a diferencia de `docker compose`, un `./mvnw spring-boot:run`
directo **no lee `.env` por su cuenta**, Spring Boot no tiene ese comportamiento
integrado; **(3)** corren `./mvnw spring-boot:run` con el perfil `local`.

Si preferís no usar el script (por ejemplo, ya tenés las variables exportadas en tu
shell de otra forma), `./mvnw spring-boot:run` a secas también funciona — pero entonces
sos vos quien tiene que exportar `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` y `JWT_SECRET`
antes, no alcanza con que `.env` exista en el directorio.

`run.ps1`/`run.sh` fuerzan el perfil `local` (más logging, `show-sql`) si no está seteado
`SPRING_PROFILES_ACTIVE`. Un `./mvnw spring-boot:run` a secas, sin el script, **no** usa
ese perfil por su cuenta — corre con el perfil `default` de Spring (sin las variantes de
`application-local.yml`).

La primera vez que la app apunta a una base vacía, Flyway crea el esquema completo y
carga los datos semilla automáticamente (tenant, usuario admin, 7 etapas, 3 salones,
servicios, orígenes, motivos de pérdida y tipos de actividad — ver
`src/main/resources/db/migration/`).

### Con Docker

```powershell
docker compose up --build
```

Ver el detalle en [`docs/docker.md`](docs/docker.md).

### Usuario para probar

| Email | Password | Rol |
|---|---|---|
| `admin@ztech.local` | `Admin123!` | `ADMIN` |

Es un usuario **semilla para desarrollo y demo**, creado por
`V2__seed_catalogs.sql` — no es una credencial de producción.

## Cómo correr los tests

```powershell
./mvnw test      # unitarios (JUnit + Mockito, rápidos, sin Docker)
./mvnw verify     # unitarios + integración (Testcontainers — requiere Docker Desktop activo)
```

Los tests de integración (sufijo `*IT`, corren con Failsafe en la fase `verify`, no con
Surefire en `test` — es la convención estándar de Maven) levantan su propio PostgreSQL
efímero con Testcontainers y corren las migraciones de Flyway desde una base vacía en
cada ejecución. No dependen de Supabase ni de `.env`.

Estado actual: **34 tests** (5 unitarios + 29 de integración), todos en verde.

## Documentación de la API

- **Swagger UI** (con la app corriendo en local): http://localhost:8080/swagger-ui.html
- **OpenAPI estático**: [`docs/openapi.yaml`](docs/openapi.yaml) — exportado desde
  `/v3/api-docs.yaml`; se regenera cada vez que cambia el contrato.
- **Colección de Postman**: [`docs/postman/`](docs/postman/) — importar
  `zTech-CRM.postman_collection.json` y el environment `zTech-CRM-Local.postman_environment.json`.
  Correr primero el request **Login** de la carpeta *Auth*: autosetea `{{accessToken}}`
  para el resto de la colección.
- **Diagramas**: [`docs/diagrams/`](docs/diagrams/) — componentes y las secuencias que
  ya existen en esta entrega (login, cambio de etapa). Los diagramas de ganar/perder
  oportunidad y reserva concurrente se agregan cuando esas funcionalidades se
  implementen (Fases 7-8).

## Estructura de paquetes

Módulo de negocio al primer nivel, capas adentro — detalle completo en
[`docs/context/02-backend-convenciones.md`](../docs/context/02-backend-convenciones.md)
y [ADR-001](../docs/decisiones/adr/ADR-001-estructura-de-paquetes.md).

```text
com.ztech.crm/
├── shared/{config,security,exception,audit,validation}/
├── tenancy/          # Tenant
├── access/           # User, Role, login
├── customers/        # Company, Contact
├── offerings/        # Venue, EventService (sólo lectura en E1)
├── catalogs/         # Stage (sólo lectura en E1)
└── opportunities/    # Opportunity, StageHistory, cambio de etapa, tablero
```

## Estado y alcance

**Implementado (Entrega 1):**

- Login con JWT (`POST /api/v1/auth/login`).
- ABM de empresas y contactos, con relación opcional entre ambos.
- Lectura de salones, servicios adicionales y etapas (precargados por Flyway).
- ABM de oportunidades (título, empresa/contacto, responsable, salón, etapa inicial,
  fecha del evento, cantidad de asistentes).
- Cambio de etapa con historial atómico (`POST /{id}/stage`).
- Tablero de oportunidades agrupadas por etapa (`GET /opportunities/board`).
- Multi-tenancy (ADR-003): toda entidad de negocio filtra por el tenant del usuario
  autenticado.

**Todavía no implementado** (ver `docs/specs-backend/tasks.md` para el detalle fase
por fase):

- Roles y permisos por alcance (`SELLER` sólo ve lo asignado) — Fase 5/6.
- ABM de usuarios, de salones/servicios, y de los catálogos configurables — Fase 6.
- Actividades e historial comercial, cierre ganado/perdido, motivos de pérdida — Fase 7.
- Validación de capacidad del salón y reserva sin solapamiento (restricción GiST) —
  Fase 8, depende de decisiones funcionales todavía abiertas (DP-07, DP-08).
- Búsqueda, filtros y paginación avanzada — Fase 9.
- Deploy en Render — en curso, gestionado por el equipo.
