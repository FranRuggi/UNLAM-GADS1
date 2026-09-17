-- Escenario comercial compacto para recorrer el frontend integrado.
-- Las credenciales de demostración usan Admin123! y exigen cambio al ingresar.

UPDATE venues SET
    locality = 'San Justo',
    description = CASE name
        WHEN 'Salón Jacarandá' THEN 'Salón principal para jornadas, lanzamientos y celebraciones corporativas.'
        WHEN 'Salón Ceibo' THEN 'Espacio versátil para capacitaciones, desayunos y encuentros de equipos.'
        ELSE 'Sala ejecutiva para reuniones, workshops y presentaciones privadas.' END,
    equipment = CASE name
        WHEN 'Salón Jacarandá' THEN ARRAY['Proyector 4K', 'Sonido profesional', 'Escenario modular', 'Wi-Fi']
        WHEN 'Salón Ceibo' THEN ARRAY['Pantalla', 'Audio', 'Pizarra', 'Wi-Fi']
        ELSE ARRAY['Pantalla 65 pulgadas', 'Videoconferencia', 'Pizarra', 'Wi-Fi'] END
WHERE tenant_id = (SELECT id FROM tenants WHERE name = 'zTech Eventos Corporativos');

INSERT INTO event_types (tenant_id, name)
SELECT tenant.id, event_type.name
FROM tenants tenant
CROSS JOIN (VALUES ('Capacitación'), ('Lanzamiento de producto'), ('Reunión ejecutiva'),
                   ('Celebración corporativa')) AS event_type(name)
WHERE tenant.name = 'zTech Eventos Corporativos';

INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role, active,
                   must_change_password)
SELECT tenant.id, account.email,
       '$2b$10$SUb/kgJkQMuMg4bfEDU9ruJTt7Jldlvr7sFAXShs14nxnoc4IS/ii',
       account.first_name, account.last_name, account.role, TRUE, TRUE
FROM tenants tenant
CROSS JOIN (VALUES
    ('vendedor@ztech.local', 'Martín', 'Sosa', 'SELLER'),
    ('gerente@ztech.local', 'Laura', 'Pereyra', 'SALES_MANAGER')
) AS account(email, first_name, last_name, role)
WHERE tenant.name = 'zTech Eventos Corporativos';

INSERT INTO companies (tenant_id, legal_name, business_name, cuit, industry, email, phone,
                       address, locality, website, status, sales_rep_id, origin_id, notes,
                       created_by, updated_by)
SELECT tenant.id, company.legal_name, company.business_name, company.cuit, company.industry,
       company.email, company.phone, company.address, company.locality, company.website,
       company.status, responsible.id, origin.id, company.notes, responsible.id, responsible.id
FROM tenants tenant
CROSS JOIN (VALUES
    ('Andina Tecnología S.A.', 'Andina Tech', '30712345678', 'Tecnología', 'eventos@andinatech.com.ar', '+54 11 4100-1200', 'Av. Belgrano 820', 'CABA', 'https://andinatech.example', 'CLIENTE', 'vendedor@ztech.local', 'Sitio web', 'Planifica su encuentro anual.'),
    ('Laboratorios Horizonte S.R.L.', 'Horizonte', '30723456789', 'Salud', 'compras@horizonte.example', '+54 11 4200-2200', 'Arieta 3100', 'San Justo', 'https://horizonte.example', 'POTENCIAL', 'vendedor@ztech.local', 'Recomendación', 'Evalúa jornadas de capacitación.'),
    ('Nexo Logística S.A.', 'Nexo Logística', '30734567890', 'Logística', 'personas@nexo.example', '+54 11 4300-3300', 'Ruta 3 4800', 'La Matanza', 'https://nexo.example', 'POTENCIAL', 'gerente@ztech.local', 'Evento', 'Necesita espacio para lanzamiento interno.'),
    ('Estudio Río y Asociados S.A.', 'Estudio Río', '30745678901', 'Servicios profesionales', 'administracion@estudiorio.example', '+54 11 4400-4400', 'Reconquista 640', 'CABA', 'https://estudiorio.example', 'CLIENTE', 'gerente@ztech.local', 'Cliente existente', 'Cliente recurrente para reuniones ejecutivas.'),
    ('Fundación Impulso', 'Impulso', '30756789012', 'Educación', 'alianzas@impulso.example', '+54 11 4500-5500', 'Mendoza 1150', 'Ramos Mejía', 'https://impulso.example', 'NO_CONTACTAR', 'admin@ztech.local', 'Redes sociales', 'Solicitud pausada por decisión de la organización.')
) AS company(legal_name, business_name, cuit, industry, email, phone, address, locality,
             website, status, responsible_email, origin_name, notes)
JOIN users responsible ON responsible.tenant_id = tenant.id AND responsible.email = company.responsible_email
JOIN origins origin ON origin.tenant_id = tenant.id AND origin.name = company.origin_name
WHERE tenant.name = 'zTech Eventos Corporativos';

INSERT INTO contacts (tenant_id, company_id, first_name, last_name, document, position, email,
                      phone, status, sales_rep_id, origin_id, notes, created_by, updated_by)
SELECT tenant.id, business.id, contact.first_name, contact.last_name, contact.document,
       contact.position, contact.email, contact.phone, contact.status, responsible.id, origin.id,
       contact.notes, responsible.id, responsible.id
FROM tenants tenant
CROSS JOIN (VALUES
    ('Andina Tech', 'Carolina', 'Suárez', '39111222', 'Jefa de Personas', 'carolina@andinatech.example', '+54 9 11 5100-1001', 'CLIENTE', 'vendedor@ztech.local', 'Sitio web', 'Prefiere contacto por correo.'),
    ('Andina Tech', 'Diego', 'Molina', '30222333', 'Compras', 'diego@andinatech.example', '+54 9 11 5100-1002', 'CLIENTE', 'vendedor@ztech.local', 'Sitio web', NULL),
    ('Horizonte', 'Paula', 'Benítez', '30333444', 'Capacitación', 'paula@horizonte.example', '+54 9 11 5200-2001', 'POTENCIAL', 'vendedor@ztech.local', 'Recomendación', 'Solicitó opciones de catering.'),
    ('Nexo Logística', 'Ramiro', 'Acosta', '30444555', 'Comunicación interna', 'ramiro@nexo.example', '+54 9 11 5300-3001', 'POTENCIAL', 'gerente@ztech.local', 'Evento', NULL),
    ('Estudio Río', 'Lucía', 'Ferrer', '30555666', 'Socia', 'lucia@estudiorio.example', '+54 9 11 5400-4001', 'CLIENTE', 'gerente@ztech.local', 'Cliente existente', 'Contacto principal.'),
    (NULL, 'Santiago', 'Vega', '30666777', 'Consultor', 'santiago.vega@example.com', '+54 9 11 5500-5001', 'POTENCIAL', 'admin@ztech.local', 'Redes sociales', 'Cliente individual.')
) AS contact(company_name, first_name, last_name, document, position, email, phone, status,
             responsible_email, origin_name, notes)
LEFT JOIN companies business ON business.tenant_id = tenant.id AND business.business_name = contact.company_name
JOIN users responsible ON responsible.tenant_id = tenant.id AND responsible.email = contact.responsible_email
JOIN origins origin ON origin.tenant_id = tenant.id AND origin.name = contact.origin_name
WHERE tenant.name = 'zTech Eventos Corporativos';

INSERT INTO opportunities (tenant_id, title, company_id, contact_id, sales_rep_id, venue_id,
                           stage_id, event_type_id, status, estimated_value, final_value,
                           probability, event_start, event_end, attendee_count,
                           estimated_close_date, closed_at, origin_id, loss_reason_id, notes,
                           created_by, updated_by)
SELECT tenant.id, opportunity.title, company.id, contact.id, responsible.id, venue.id, stage.id,
       event_type.id, opportunity.status, opportunity.estimated_value, opportunity.final_value,
       opportunity.probability, opportunity.event_start, opportunity.event_end,
       opportunity.attendees, opportunity.estimated_close_date, opportunity.closed_at,
       origin.id, loss_reason.id, opportunity.notes, responsible.id, responsible.id
FROM tenants tenant
CROSS JOIN (VALUES
    ('Jornada anual Andina', 'Andina Tech', 'Carolina', 'vendedor@ztech.local', 'Salón Jacarandá', 'Consulta recibida', 'Capacitación', 'ABIERTA', 680000.00, NULL, 20, '2026-10-08 12:00:00+00'::timestamptz, '2026-10-08 21:00:00+00'::timestamptz, 45, '2026-09-25'::date, NULL::timestamptz, 'Sitio web', NULL, 'Jornada para líderes de equipo.'),
    ('Workshop Horizonte', 'Horizonte', 'Paula', 'vendedor@ztech.local', 'Salón Ceibo', 'Necesidad relevada', 'Capacitación', 'ABIERTA', 390000.00, NULL, 35, '2026-10-15 13:00:00+00'::timestamptz, '2026-10-15 20:00:00+00'::timestamptz, 28, '2026-09-28'::date, NULL::timestamptz, 'Recomendación', NULL, 'Incluye catering estándar.'),
    ('Presentación Nexo', 'Nexo Logística', 'Ramiro', 'gerente@ztech.local', 'Salón Jacarandá', 'Visita al salón', 'Lanzamiento de producto', 'ABIERTA', 790000.00, NULL, 50, '2026-10-22 14:00:00+00'::timestamptz, '2026-10-22 22:00:00+00'::timestamptz, 50, '2026-10-02'::date, NULL::timestamptz, 'Evento', NULL, 'Requiere escenario y audio.'),
    ('Desayuno Estudio Río', 'Estudio Río', 'Lucía', 'gerente@ztech.local', 'Salón Palo Borracho', 'Propuesta enviada', 'Reunión ejecutiva', 'ABIERTA', 235000.00, NULL, 65, '2026-10-29 11:00:00+00'::timestamptz, '2026-10-29 15:00:00+00'::timestamptz, 12, '2026-09-30'::date, NULL::timestamptz, 'Cliente existente', NULL, 'Desayuno de socios.'),
    ('Encuentro de aliados Impulso', 'Impulso', NULL, 'admin@ztech.local', 'Salón Ceibo', 'Negociación', 'Evento corporativo', 'ABIERTA', 450000.00, NULL, 75, '2026-11-05 15:00:00+00'::timestamptz, '2026-11-05 21:00:00+00'::timestamptz, 30, '2026-10-05'::date, NULL::timestamptz, 'Redes sociales', NULL, 'Aguardando confirmación institucional.'),
    ('Directorio trimestral Río', 'Estudio Río', 'Lucía', 'gerente@ztech.local', 'Salón Palo Borracho', 'Ganada / Reservado', 'Reunión ejecutiva', 'GANADA', 190000.00, 185000.00, 100, '2026-09-18 12:00:00+00'::timestamptz, '2026-09-18 16:00:00+00'::timestamptz, 10, '2026-09-10'::date, '2026-09-09 18:00:00+00'::timestamptz, 'Cliente existente', NULL, 'Reserva confirmada.'),
    ('Celebración de cierre Andina', 'Andina Tech', 'Diego', 'vendedor@ztech.local', 'Salón Jacarandá', 'Perdida', 'Celebración corporativa', 'PERDIDA', 920000.00, NULL, 0, '2026-12-18 20:00:00+00'::timestamptz, '2026-12-19 03:00:00+00'::timestamptz, 50, '2026-09-08'::date, '2026-09-08 20:00:00+00'::timestamptz, 'Sitio web', 'Precio', 'Eligieron una alternativa de menor costo.')
) AS opportunity(title, company_name, contact_first_name, responsible_email, venue_name,
                 stage_name, event_type_name, status, estimated_value, final_value, probability,
                 event_start, event_end, attendees, estimated_close_date, closed_at,
                 origin_name, loss_reason_name, notes)
LEFT JOIN companies company ON company.tenant_id = tenant.id AND company.business_name = opportunity.company_name
LEFT JOIN contacts contact ON contact.tenant_id = tenant.id AND contact.first_name = opportunity.contact_first_name
JOIN users responsible ON responsible.tenant_id = tenant.id AND responsible.email = opportunity.responsible_email
JOIN venues venue ON venue.tenant_id = tenant.id AND venue.name = opportunity.venue_name
JOIN stages stage ON stage.tenant_id = tenant.id AND stage.name = opportunity.stage_name
JOIN event_types event_type ON event_type.tenant_id = tenant.id AND event_type.name = opportunity.event_type_name
JOIN origins origin ON origin.tenant_id = tenant.id AND origin.name = opportunity.origin_name
LEFT JOIN loss_reasons loss_reason ON loss_reason.tenant_id = tenant.id AND loss_reason.name = opportunity.loss_reason_name
WHERE tenant.name = 'zTech Eventos Corporativos';

INSERT INTO opportunity_event_services (opportunity_id, event_service_id)
SELECT opportunity.id, service.id
FROM opportunities opportunity
JOIN event_services service ON service.tenant_id = opportunity.tenant_id
WHERE opportunity.title IN ('Jornada anual Andina', 'Workshop Horizonte', 'Presentación Nexo')
  AND service.name IN ('Catering estándar', 'Audio y sonido');

WITH paths(title, stage_names) AS (VALUES
    ('Jornada anual Andina', ARRAY['Consulta recibida']),
    ('Workshop Horizonte', ARRAY['Consulta recibida', 'Necesidad relevada']),
    ('Presentación Nexo', ARRAY['Consulta recibida', 'Necesidad relevada', 'Visita al salón']),
    ('Desayuno Estudio Río', ARRAY['Consulta recibida', 'Necesidad relevada', 'Visita al salón', 'Propuesta enviada']),
    ('Encuentro de aliados Impulso', ARRAY['Consulta recibida', 'Necesidad relevada', 'Visita al salón', 'Propuesta enviada', 'Negociación']),
    ('Directorio trimestral Río', ARRAY['Consulta recibida', 'Necesidad relevada', 'Propuesta enviada', 'Negociación', 'Ganada / Reservado']),
    ('Celebración de cierre Andina', ARRAY['Consulta recibida', 'Necesidad relevada', 'Propuesta enviada', 'Negociación', 'Perdida'])
), expanded AS (
    SELECT opportunity.id opportunity_id, opportunity.tenant_id, opportunity.created_by,
           stage_name, ordinal, lag(stage_name) OVER (PARTITION BY opportunity.id ORDER BY ordinal) previous_name
    FROM paths
    JOIN opportunities opportunity ON opportunity.title = paths.title
    CROSS JOIN LATERAL unnest(paths.stage_names) WITH ORDINALITY AS value(stage_name, ordinal)
)
INSERT INTO stage_history (tenant_id, opportunity_id, from_stage_id, to_stage_id, changed_at, changed_by, note)
SELECT expanded.tenant_id, expanded.opportunity_id, previous_stage.id, current_stage.id,
       '2026-09-01 13:00:00+00'::timestamptz + (expanded.ordinal * INTERVAL '1 day'),
       expanded.created_by, CASE WHEN expanded.ordinal = 1 THEN 'Etapa inicial' ELSE 'Avance comercial' END
FROM expanded
JOIN stages current_stage ON current_stage.tenant_id = expanded.tenant_id AND current_stage.name = expanded.stage_name
LEFT JOIN stages previous_stage ON previous_stage.tenant_id = expanded.tenant_id AND previous_stage.name = expanded.previous_name;

INSERT INTO activities (tenant_id, type_id, occurred_at, company_id, contact_id, opportunity_id,
                        description, result, created_by, created_at)
SELECT tenant.id, activity_type.id, activity.occurred_at, company.id, contact.id, opportunity.id,
       activity.description, activity.result, author.id, activity.occurred_at + INTERVAL '10 minutes'
FROM tenants tenant
CROSS JOIN (VALUES
    ('Llamada', '2026-09-03 14:00:00+00'::timestamptz, 'Andina Tech', 'Carolina', 'Jornada anual Andina', 'Primera conversación sobre la jornada anual.', 'Se acordó relevar agenda y asistentes.', 'vendedor@ztech.local'),
    ('Reunión virtual', '2026-09-05 16:00:00+00'::timestamptz, 'Horizonte', 'Paula', 'Workshop Horizonte', 'Relevamiento de necesidades de capacitación.', 'Solicitaron propuesta con catering.', 'vendedor@ztech.local'),
    ('Reunión presencial', '2026-09-06 18:00:00+00'::timestamptz, 'Nexo Logística', 'Ramiro', 'Presentación Nexo', 'Visita técnica al salón Jacarandá.', 'Validaron escenario y conectividad.', 'gerente@ztech.local'),
    ('Envío de propuesta', '2026-09-07 13:00:00+00'::timestamptz, 'Estudio Río', 'Lucía', 'Desayuno Estudio Río', 'Propuesta por alquiler y desayuno.', 'Pendiente de aprobación de socios.', 'gerente@ztech.local'),
    ('Mensaje', '2026-09-08 15:00:00+00'::timestamptz, 'Impulso', NULL, 'Encuentro de aliados Impulso', 'Seguimiento de la propuesta institucional.', 'Piden una semana adicional.', 'admin@ztech.local'),
    ('Nota interna', '2026-09-09 18:10:00+00'::timestamptz, 'Estudio Río', 'Lucía', 'Directorio trimestral Río', 'Reserva confirmada por administración.', 'Horario y sala bloqueados.', 'gerente@ztech.local'),
    ('Correo electrónico', '2026-09-08 20:10:00+00'::timestamptz, 'Andina Tech', 'Diego', 'Celebración de cierre Andina', 'Confirmación de cierre de negociación.', 'La propuesta se perdió por precio.', 'vendedor@ztech.local'),
    ('Llamada', '2026-09-11 14:30:00+00'::timestamptz, 'Andina Tech', 'Carolina', NULL, 'Consulta por opciones de menú.', 'Se enviará detalle de catering.', 'vendedor@ztech.local'),
    ('Correo electrónico', '2026-09-12 12:00:00+00'::timestamptz, 'Horizonte', 'Paula', NULL, 'Envío de ficha técnica del salón Ceibo.', 'Documento recibido.', 'vendedor@ztech.local'),
    ('Nota interna', '2026-09-13 17:00:00+00'::timestamptz, 'Nexo Logística', NULL, NULL, 'Revisar disponibilidad de técnico de sonido.', 'Pendiente de coordinación.', 'gerente@ztech.local')
) AS activity(type_name, occurred_at, company_name, contact_first_name, opportunity_title,
              description, result, author_email)
JOIN activity_types activity_type ON activity_type.tenant_id = tenant.id AND activity_type.name = activity.type_name
LEFT JOIN companies company ON company.tenant_id = tenant.id AND company.business_name = activity.company_name
LEFT JOIN contacts contact ON contact.tenant_id = tenant.id AND contact.first_name = activity.contact_first_name
LEFT JOIN opportunities opportunity ON opportunity.tenant_id = tenant.id AND opportunity.title = activity.opportunity_title
JOIN users author ON author.tenant_id = tenant.id AND author.email = activity.author_email
WHERE tenant.name = 'zTech Eventos Corporativos';
