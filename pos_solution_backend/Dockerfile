# --- Fase 1: Bouwen (Maven) ---
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# --- Fase 2: Draaien (Java) ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
VOLUME /data
ENTRYPOINT ["java", "-jar", "app.jar"]
