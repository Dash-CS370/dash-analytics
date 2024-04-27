# Stage 1: Build the application
FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /build

#  build/
#    | ----- src/
#    | ----- pom.xml

# Copy the pom.xml and source code and build the application : FROM -> TO
COPY ./pom.xml .

# FROM -> TO
COPY src ./src

RUN mvn clean install


# Stage 2: Run the application
FROM openjdk:17-jdk-slim

LABEL authors="arbul"

WORKDIR /app

# Copy the built JAR from the previous stage (FROM -> TO)
COPY --from=build /build/target/OAuthorization-Server-1.0-SNAPSHOT.jar /app/OAuthorization-Server.jar

# Expose the port the app runs on internally (documentation)
EXPOSE 9000

# Command to run the application
ENTRYPOINT ["java", "-jar", "OAuthorization-Server.jar"]
