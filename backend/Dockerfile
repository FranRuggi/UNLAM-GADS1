# syntax=docker/dockerfile:1

# ---- build ----
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# ---- runtime ----
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/target/crm-backend.jar ./app.jar
USER app

# Render inyecta PORT en runtime; 8080 es el default para uso local (ver application.yml).
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
