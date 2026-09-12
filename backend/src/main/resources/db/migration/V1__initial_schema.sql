-- Esquema inicial de zTech CRM.
-- Referencia: .claude/specs-backend/design.md §3-4, ADR-003 (multi-tenancy).
-- La restricción de exclusión GiST para reservas se agrega en una migración
-- posterior, junto con la resolución de DP-07 (semántica temporal).

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- =====================================================================
-- tenancy
-- =====================================================================

CREATE TABLE tenants (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name       TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- access
-- =====================================================================

CREATE TABLE users (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id     BIGINT NOT NULL REFERENCES tenants (id),
    email         TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('ADMIN', 'SELLER', 'SALES_MANAGER')),
    active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by    BIGINT REFERENCES users (id),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by    BIGINT REFERENCES users (id),
    -- Único a nivel sistema, no por tenant: el login (BE-SEC-01) recibe sólo
    -- email + password, sin selector de organización (no lo pide la consigna,
    -- y BE-SEC-08 no tiene alta pública de tenants). Con un solo tenant
    -- funcionando en la práctica, la unicidad por tenant sería equivalente
    -- pero obligaría a resolver el tenant antes de autenticar.
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX ix_users_tenant ON users (tenant_id);

-- =====================================================================
-- catalogs (configurables por ADMIN, precargados por V2)
-- =====================================================================

CREATE TABLE origins (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id  BIGINT NOT NULL REFERENCES tenants (id),
    name       TEXT NOT NULL,
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_origins_tenant_name UNIQUE (tenant_id, name)
);

CREATE TABLE loss_reasons (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id  BIGINT NOT NULL REFERENCES tenants (id),
    name       TEXT NOT NULL,
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_loss_reasons_tenant_name UNIQUE (tenant_id, name)
);

CREATE TABLE activity_types (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id  BIGINT NOT NULL REFERENCES tenants (id),
    name       TEXT NOT NULL,
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_activity_types_tenant_name UNIQUE (tenant_id, name)
);

CREATE TABLE stages (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id  BIGINT NOT NULL REFERENCES tenants (id),
    name       TEXT NOT NULL,
    position   INTEGER NOT NULL,
    kind       TEXT NOT NULL CHECK (kind IN ('OPEN', 'WON', 'LOST')),
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_stages_tenant_position UNIQUE (tenant_id, position)
);

-- =====================================================================
-- offerings ("producto o servicio" de la consigna — ADR-004)
-- =====================================================================

CREATE TABLE venues (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id  BIGINT NOT NULL REFERENCES tenants (id),
    name       TEXT NOT NULL,
    capacity   INTEGER NOT NULL CHECK (capacity > 0),
    rate       NUMERIC(15, 2),
    address    TEXT,
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by BIGINT REFERENCES users (id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by BIGINT REFERENCES users (id)
);

CREATE INDEX ix_venues_tenant ON venues (tenant_id);

CREATE TABLE event_services (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id   BIGINT NOT NULL REFERENCES tenants (id),
    name        TEXT NOT NULL,
    description TEXT,
    price       NUMERIC(15, 2),
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by  BIGINT REFERENCES users (id),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by  BIGINT REFERENCES users (id)
);

CREATE INDEX ix_event_services_tenant ON event_services (tenant_id);

-- =====================================================================
-- customers
-- =====================================================================

CREATE TABLE companies (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id    BIGINT NOT NULL REFERENCES tenants (id),
    name         TEXT NOT NULL,
    cuit         TEXT,
    industry     TEXT,
    email        TEXT,
    phone        TEXT,
    address      TEXT,
    website      TEXT,
    status       TEXT NOT NULL CHECK (status IN ('POTENCIAL', 'CLIENTE', 'INACTIVO', 'NO_CONTACTAR')),
    sales_rep_id BIGINT REFERENCES users (id),
    origin_id    BIGINT REFERENCES origins (id),
    notes        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by   BIGINT REFERENCES users (id),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by   BIGINT REFERENCES users (id)
);

CREATE INDEX ix_companies_tenant ON companies (tenant_id);
CREATE INDEX ix_companies_tenant_sales_rep ON companies (tenant_id, sales_rep_id);
CREATE UNIQUE INDEX ux_companies_tenant_cuit ON companies (tenant_id, cuit) WHERE cuit IS NOT NULL;

CREATE TABLE contacts (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id    BIGINT NOT NULL REFERENCES tenants (id),
    company_id   BIGINT REFERENCES companies (id),
    first_name   TEXT NOT NULL,
    last_name    TEXT NOT NULL,
    document     TEXT,
    position     TEXT,
    email        TEXT,
    phone        TEXT,
    status       TEXT NOT NULL CHECK (status IN ('POTENCIAL', 'CLIENTE', 'INACTIVO', 'NO_CONTACTAR')),
    sales_rep_id BIGINT REFERENCES users (id),
    origin_id    BIGINT REFERENCES origins (id),
    notes        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by   BIGINT REFERENCES users (id),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by   BIGINT REFERENCES users (id)
);

CREATE INDEX ix_contacts_tenant ON contacts (tenant_id);
CREATE INDEX ix_contacts_tenant_company ON contacts (tenant_id, company_id);
CREATE INDEX ix_contacts_tenant_sales_rep ON contacts (tenant_id, sales_rep_id);
CREATE UNIQUE INDEX ux_contacts_tenant_document ON contacts (tenant_id, document) WHERE document IS NOT NULL;

-- =====================================================================
-- opportunities
-- =====================================================================

CREATE TABLE opportunities (
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id             BIGINT NOT NULL REFERENCES tenants (id),
    title                 TEXT NOT NULL,
    company_id            BIGINT REFERENCES companies (id),
    contact_id            BIGINT REFERENCES contacts (id),
    sales_rep_id          BIGINT NOT NULL REFERENCES users (id),
    venue_id              BIGINT NOT NULL REFERENCES venues (id),
    stage_id              BIGINT NOT NULL REFERENCES stages (id),
    status                TEXT NOT NULL CHECK (status IN ('ABIERTA', 'GANADA', 'PERDIDA')),
    estimated_value       NUMERIC(15, 2),
    final_value           NUMERIC(15, 2),
    probability           INTEGER CHECK (probability BETWEEN 0 AND 100),
    event_date            TIMESTAMPTZ NOT NULL,
    attendee_count        INTEGER NOT NULL CHECK (attendee_count > 0),
    estimated_close_date  DATE,
    closed_at             TIMESTAMPTZ,
    origin_id             BIGINT REFERENCES origins (id),
    loss_reason_id        BIGINT REFERENCES loss_reasons (id),
    notes                 TEXT,
    version               BIGINT NOT NULL DEFAULT 0,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by            BIGINT REFERENCES users (id),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by            BIGINT REFERENCES users (id),
    CONSTRAINT ck_opportunities_party CHECK (company_id IS NOT NULL OR contact_id IS NOT NULL)
);

CREATE INDEX ix_opportunities_tenant ON opportunities (tenant_id);
CREATE INDEX ix_opportunities_tenant_stage ON opportunities (tenant_id, stage_id);
CREATE INDEX ix_opportunities_tenant_sales_rep ON opportunities (tenant_id, sales_rep_id);
CREATE INDEX ix_opportunities_tenant_status ON opportunities (tenant_id, status);
CREATE INDEX ix_opportunities_tenant_venue ON opportunities (tenant_id, venue_id);

-- =====================================================================
-- historial de etapas — append-only (BE-ACT-03/04)
-- =====================================================================

CREATE TABLE stage_history (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id      BIGINT NOT NULL REFERENCES tenants (id),
    opportunity_id BIGINT NOT NULL REFERENCES opportunities (id),
    from_stage_id  BIGINT REFERENCES stages (id),
    to_stage_id    BIGINT NOT NULL REFERENCES stages (id),
    changed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    changed_by     BIGINT NOT NULL REFERENCES users (id),
    note           TEXT
);

CREATE INDEX ix_stage_history_tenant_opportunity ON stage_history (tenant_id, opportunity_id);

-- =====================================================================
-- activities
-- =====================================================================

CREATE TABLE activities (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id      BIGINT NOT NULL REFERENCES tenants (id),
    type_id        BIGINT NOT NULL REFERENCES activity_types (id),
    occurred_at    TIMESTAMPTZ NOT NULL,
    company_id     BIGINT REFERENCES companies (id),
    contact_id     BIGINT REFERENCES contacts (id),
    opportunity_id BIGINT REFERENCES opportunities (id),
    description    TEXT,
    result         TEXT,
    created_by     BIGINT NOT NULL REFERENCES users (id),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_activities_related CHECK (
        company_id IS NOT NULL OR contact_id IS NOT NULL OR opportunity_id IS NOT NULL
    )
);

CREATE INDEX ix_activities_tenant_company ON activities (tenant_id, company_id);
CREATE INDEX ix_activities_tenant_contact ON activities (tenant_id, contact_id);
CREATE INDEX ix_activities_tenant_opportunity ON activities (tenant_id, opportunity_id);
