#!/usr/bin/env bash
# Levanta la API en local: valida el JDK, carga backend/.env al proceso y corre
# ./mvnw spring-boot:run. Sin esto, Spring Boot no lee .env por su cuenta — sólo
# docker-compose.yml lo hace (via env_file), no una corrida directa con Maven.
set -euo pipefail
cd "$(dirname "$0")"

# Mismo criterio que mvnw: si JAVA_HOME está seteado, usa ESE java directo — nunca se
# arma un PATH nuevo a mano (en Git Bash, un JAVA_HOME con "C:" rompe el PATH, porque
# ":" es el separador de entradas en Unix).
if [ -n "${JAVA_HOME:-}" ]; then
    JAVA_BIN="$JAVA_HOME/bin/java"
else
    JAVA_BIN="java"
fi

if ! "$JAVA_BIN" -version 2>&1 | grep -q '"25'; then
    echo "Se necesita JDK 25 activo. '$JAVA_BIN -version' mostró:" >&2
    "$JAVA_BIN" -version 2>&1 >&2 || true
    echo "Revisá JAVA_HOME (ver README.md -> Requisitos previos)." >&2
    exit 1
fi

if [ ! -f .env ]; then
    echo "Falta backend/.env -- copiá .env.example a .env y completá los valores reales (ver README.md)." >&2
    exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

export SPRING_PROFILES_ACTIVE="${SPRING_PROFILES_ACTIVE:-local}"

echo "JDK activo: $("$JAVA_BIN" -version 2>&1 | head -n1)"
echo "Perfil: $SPRING_PROFILES_ACTIVE"
echo "Arrancando..."

./mvnw spring-boot:run
