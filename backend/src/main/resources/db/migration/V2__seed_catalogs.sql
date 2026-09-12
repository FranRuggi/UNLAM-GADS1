-- Datos semilla: un tenant, un ADMIN habilitado, el embudo de DP-06, y los
-- catálogos y salones precargados que exige E1 (BE-ACC-01, BE-CAT-01, BE-OFF-01/03).
-- Referencia: .claude/specs-backend/design.md §4, docs/decisiones/decisiones-pendientes.md (DP-06).

-- =====================================================================
-- Tenant semilla
-- =====================================================================

INSERT INTO tenants (name) VALUES ('zTech Eventos Corporativos');

-- =====================================================================
-- Usuario ADMIN semilla
-- Password de demo: "Admin123!" (BCrypt, cost 10). Documentado en
-- backend/README.md para la demostración; no es una credencial productiva.
-- =====================================================================

INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role, active)
SELECT id, 'admin@ztech.local',
       '$2b$10$SUb/kgJkQMuMg4bfEDU9ruJTt7Jldlvr7sFAXShs14nxnoc4IS/ii',
       'Admin', 'zTech', 'ADMIN', TRUE
FROM tenants WHERE name = 'zTech Eventos Corporativos';

-- =====================================================================
-- Etapas del embudo (DP-06) — 7 etapas con visita al salón
-- =====================================================================

INSERT INTO stages (tenant_id, name, position, kind)
SELECT t.id, s.name, s.position, s.kind
FROM tenants t
CROSS JOIN (VALUES
    ('Consulta recibida',   1, 'OPEN'),
    ('Necesidad relevada',  2, 'OPEN'),
    ('Visita al salón',     3, 'OPEN'),
    ('Propuesta enviada',   4, 'OPEN'),
    ('Negociación',         5, 'OPEN'),
    ('Ganada / Reservado',  6, 'WON'),
    ('Perdida',             7, 'LOST')
) AS s(name, position, kind)
WHERE t.name = 'zTech Eventos Corporativos';

-- =====================================================================
-- Salones (DP-09, ADR-004) — precargados para E1
-- =====================================================================

INSERT INTO venues (tenant_id, name, capacity, rate, address)
SELECT t.id, v.name, v.capacity, v.rate, v.address
FROM tenants t
CROSS JOIN (VALUES
    ('Salón Jacarandá', 50, 350000.00, 'Av. Rivadavia 4500, San Justo'),
    ('Salón Ceibo',      30, 220000.00, 'Av. Rivadavia 4500, San Justo'),
    ('Salón Palo Borracho', 15, 140000.00, 'Av. Rivadavia 4500, San Justo')
) AS v(name, capacity, rate, address)
WHERE t.name = 'zTech Eventos Corporativos';

-- =====================================================================
-- Servicios adicionales (ADR-004)
-- =====================================================================

INSERT INTO event_services (tenant_id, name, description, price)
SELECT t.id, es.name, es.description, es.price
FROM tenants t
CROSS JOIN (VALUES
    ('Catering estándar',   'Menú de tres pasos por persona', 15000.00),
    ('Audio y sonido',      'Equipo de sonido con técnico', 60000.00),
    ('Decoración temática', 'Ambientación y centros de mesa', 45000.00),
    ('Mobiliario adicional','Mesas, sillas y vajilla extra', 25000.00)
) AS es(name, description, price)
WHERE t.name = 'zTech Eventos Corporativos';

-- =====================================================================
-- Orígenes comerciales
-- =====================================================================

INSERT INTO origins (tenant_id, name)
SELECT t.id, o.name
FROM tenants t
CROSS JOIN (VALUES
    ('Sitio web'),
    ('Redes sociales'),
    ('Publicidad'),
    ('Recomendación'),
    ('Evento'),
    ('Prospección comercial'),
    ('Cliente existente')
) AS o(name)
WHERE t.name = 'zTech Eventos Corporativos';

-- =====================================================================
-- Motivos de pérdida
-- =====================================================================

INSERT INTO loss_reasons (tenant_id, name)
SELECT t.id, lr.name
FROM tenants t
CROSS JOIN (VALUES
    ('Precio'),
    ('Falta de presupuesto'),
    ('Elección de un competidor'),
    ('Salón no disponible en la fecha'),
    ('Falta de respuesta'),
    ('Decisión postergada')
) AS lr(name)
WHERE t.name = 'zTech Eventos Corporativos';

-- =====================================================================
-- Tipos de actividad
-- =====================================================================

INSERT INTO activity_types (tenant_id, name)
SELECT t.id, at.name
FROM tenants t
CROSS JOIN (VALUES
    ('Llamada'),
    ('Correo electrónico'),
    ('Mensaje'),
    ('Reunión presencial'),
    ('Reunión virtual'),
    ('Demostración'),
    ('Envío de propuesta'),
    ('Nota interna'),
    ('Otro')
) AS at(name)
WHERE t.name = 'zTech Eventos Corporativos';
