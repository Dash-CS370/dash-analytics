#Base image to build from
FROM openjdk:17-jdk-slim

LABEL authors="arbul"

# Working directory inside env (parent dir)
WORKDIR /app

# Copy JAR file (maven project build file) from local env into the container
COPY ./target/OAuthorization-Server-1.0-SNAPSHOT.jar /app/OAuthorization-Server-1.0-SNAPSHOT.jar

# Cmd to run Eureka service
ENTRYPOINT ["java", "-jar", "OAuthorization-Server-1.0-SNAPSHOT.jar"]
