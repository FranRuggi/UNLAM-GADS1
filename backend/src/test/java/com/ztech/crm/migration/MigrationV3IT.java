package com.ztech.crm.migration;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationVersion;
import org.junit.jupiter.api.Test;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

/** Comprueba V3 sobre datos legacy reales, no sólo como parte de una base vacía. */
@Testcontainers
class MigrationV3IT {

    @Container
    static PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:16-alpine");

    @Test
    void migratesExistingV2DataWithoutLosingAssignmentsOrEventDates() throws Exception {
        flywayAt(MigrationVersion.fromVersion("2")).migrate();

        try (Connection connection = connection(); Statement statement = connection.createStatement()) {
            statement.executeUpdate("""
                    INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role, active)
                    VALUES (1, 'seller.legacy@ztech.local', 'hash-legacy', 'Sara', 'Legacy', 'SELLER', TRUE)
                    """);
            statement.executeUpdate("""
                    INSERT INTO companies (tenant_id, name, status, created_by)
                    VALUES (1, 'Empresa histórica', 'POTENCIAL', 2)
                    """);
            statement.executeUpdate("""
                    INSERT INTO contacts (tenant_id, company_id, first_name, last_name, status)
                    VALUES (1, 1, 'Carla', 'Contacto', 'POTENCIAL')
                    """);
            statement.executeUpdate("""
                    INSERT INTO opportunities (
                        tenant_id, title, company_id, sales_rep_id, venue_id, stage_id,
                        status, event_date, attendee_count)
                    VALUES (1, 'Evento histórico', 1, 2, 1, 1,
                            'ABIERTA', TIMESTAMPTZ '2026-10-15 13:00:00+00', 20)
                    """);
        }

        flywayAt(null).migrate();

        try (Connection connection = connection(); Statement statement = connection.createStatement()) {
            try (ResultSet company = statement.executeQuery("""
                    SELECT legal_name, business_name, sales_rep_id
                    FROM companies WHERE id = 1
                    """)) {
                assertThat(company.next()).isTrue();
                assertThat(company.getString("legal_name")).isEqualTo("Empresa histórica");
                assertThat(company.getString("business_name")).isEqualTo("Empresa histórica");
                assertThat(company.getLong("sales_rep_id")).isEqualTo(2L);
            }

            try (ResultSet contact = statement.executeQuery("SELECT sales_rep_id FROM contacts WHERE id = 1")) {
                assertThat(contact.next()).isTrue();
                assertThat(contact.getLong("sales_rep_id")).isEqualTo(1L);
            }

            try (ResultSet opportunity = statement.executeQuery("""
                    SELECT event_start, event_end, event_type_id
                    FROM opportunities WHERE id = 1
                    """)) {
                assertThat(opportunity.next()).isTrue();
                assertThat(opportunity.getTimestamp("event_end").toInstant())
                        .isEqualTo(opportunity.getTimestamp("event_start").toInstant().plusSeconds(86_400));
                assertThat(opportunity.getLong("event_type_id")).isPositive();
            }

            try (ResultSet legacyColumn = statement.executeQuery("""
                    SELECT COUNT(*) FROM information_schema.columns
                    WHERE table_schema = 'public'
                      AND table_name = 'opportunities'
                      AND column_name = 'event_date'
                    """)) {
                assertThat(legacyColumn.next()).isTrue();
                assertThat(legacyColumn.getInt(1)).isZero();
            }
        }
    }

    private Flyway flywayAt(MigrationVersion target) {
        var configuration = Flyway.configure()
                .dataSource(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword())
                .locations("classpath:db/migration");
        if (target != null) configuration.target(target);
        return configuration.load();
    }

    private Connection connection() throws Exception {
        return DriverManager.getConnection(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
    }
}
