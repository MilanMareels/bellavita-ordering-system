# --- Fase 1: Bouwen (Maven) ---
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies alvast (voor snelheid)
RUN mvn dependency:go-offline
COPY src ./src
# Bouw de applicatie
RUN mvn clean package -DskipTests

# --- Fase 2: Draaien (Java) ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Kopieer de JAR uit fase 1
COPY --from=build /app/target/*.jar app.jar

# Map voor de database
VOLUME /data

# Start commando
ENTRYPOINT ["java", "-jar", "app.jar"]