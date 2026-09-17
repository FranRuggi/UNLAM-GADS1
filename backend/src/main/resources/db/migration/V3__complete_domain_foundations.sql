-- Fundaciones posteriores a E1. V1/V2 son inmutables.

-- -----------------------------------------------------------------------------
-- Seguridad y administración de usuarios
-- -----------------------------------------------------------------------------

ALTER TABLE users
    ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN auth_version BIGINT NOT NULL DEFAULT 0,
    ADD CONSTRAINT ck_users_auth_version CHECK (auth_version >= 0);

-- La cuenta semilla de demostración no debe conservar su clave inicial al publicarse.
UPDATE users
SET must_change_password = TRUE
WHERE email = 'admin@ztech.local';

-- -----------------------------------------------------------------------------
-- Clientes y responsables obligatorios
-- -----------------------------------------------------------------------------

ALTER TABLE companies RENAME COLUMN name TO business_name;
ALTER TABLE companies
    ADD COLUMN legal_name TEXT,
    ADD COLUMN locality TEXT;

UPDATE companies SET legal_name = business_name WHERE legal_name IS NULL;

UPDATE companies company
SET sales_rep_id = COALESCE(
    company.sales_rep_id,
    CASE WHEN EXISTS (
        SELECT 1 FROM users creator
        WHERE creator.id = company.created_by
          AND creator.tenant_id = company.tenant_id
          AND creator.active
    ) THEN company.created_by END,
    (SELECT MIN(admin_user.id)
     FROM users admin_user
     WHERE admin_user.tenant_id = company.tenant_id
       AND admin_user.role = 'ADMIN'
       AND admin_user.active)
)
WHERE company.sales_rep_id IS NULL;

UPDATE contacts contact
SET sales_rep_id = COALESCE(
    contact.sales_rep_id,
    CASE WHEN EXISTS (
        SELECT 1 FROM users creator
        WHERE creator.id = contact.created_by
          AND creator.tenant_id = contact.tenant_id
          AND creator.active
    ) THEN contact.created_by END,
    (SELECT MIN(admin_user.id)
     FROM users admin_user
     WHERE admin_user.tenant_id = contact.tenant_id
       AND admin_user.role = 'ADMIN'
       AND admin_user.active)
)
WHERE contact.sales_rep_id IS NULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM companies WHERE sales_rep_id IS NULL)
       OR EXISTS (SELECT 1 FROM contacts WHERE sales_rep_id IS NULL) THEN
        RAISE EXCEPTION 'No se pudo asignar un responsable activo a todos los clientes';
    END IF;
END $$;

ALTER TABLE companies
    ALTER COLUMN legal_name SET NOT NULL,
    ALTER COLUMN sales_rep_id SET NOT NULL;
ALTER TABLE contacts ALTER COLUMN sales_rep_id SET NOT NULL;

-- -----------------------------------------------------------------------------
-- Salones y tipos de evento
-- -----------------------------------------------------------------------------

ALTER TABLE venues
    ADD COLUMN status TEXT,
    ADD COLUMN locality TEXT,
    ADD COLUMN description TEXT,
    ADD COLUMN equipment TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE venues
SET status = CASE WHEN active THEN 'DISPONIBLE' ELSE 'INACTIVO' END;

ALTER TABLE venues
    ALTER COLUMN status SET NOT NULL,
    ADD CONSTRAINT ck_venues_status
        CHECK (status IN ('DISPONIBLE', 'MANTENIMIENTO', 'INACTIVO'));
ALTER TABLE venues DROP COLUMN active;

CREATE TABLE event_types (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id  BIGINT NOT NULL REFERENCES tenants (id),
    name       TEXT NOT NULL,
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_event_types_tenant_name UNIQUE (tenant_id, name)
);
CREATE INDEX ix_event_types_tenant ON event_types (tenant_id);

INSERT INTO event_types (tenant_id, name)
SELECT id, 'Evento corporativo' FROM tenants;

-- -----------------------------------------------------------------------------
-- Intervalos de eventos y servicios asociados
-- -----------------------------------------------------------------------------

ALTER TABLE opportunities
    ADD COLUMN event_type_id BIGINT REFERENCES event_types (id),
    ADD COLUMN event_start TIMESTAMPTZ,
    ADD COLUMN event_end TIMESTAMPTZ;

UPDATE opportunities opportunity
SET event_type_id = (
        SELECT event_type.id
        FROM event_types event_type
        WHERE event_type.tenant_id = opportunity.tenant_id
          AND event_type.name = 'Evento corporativo'
    ),
    event_start = event_date,
    event_end = event_date + INTERVAL '1 day';

ALTER TABLE opportunities
    ALTER COLUMN event_type_id SET NOT NULL,
    ALTER COLUMN event_start SET NOT NULL,
    ALTER COLUMN event_end SET NOT NULL,
    ADD CONSTRAINT ck_opportunities_event_range CHECK (event_end > event_start);
ALTER TABLE opportunities DROP COLUMN event_date;

CREATE INDEX ix_opportunities_tenant_event_range
    ON opportunities (tenant_id, event_start, event_end);

CREATE TABLE opportunity_event_services (
    opportunity_id BIGINT NOT NULL REFERENCES opportunities (id),
    event_service_id BIGINT NOT NULL REFERENCES event_services (id),
    PRIMARY KEY (opportunity_id, event_service_id)
);
CREATE INDEX ix_opportunity_event_services_service
    ON opportunity_event_services (event_service_id);

ALTER TABLE opportunities
    ADD CONSTRAINT no_overlapping_won_reservation
    EXCLUDE USING gist (
        tenant_id WITH =,
        venue_id WITH =,
        tstzrange(event_start, event_end, '[)') WITH &&
    ) WHERE (status = 'GANADA');
