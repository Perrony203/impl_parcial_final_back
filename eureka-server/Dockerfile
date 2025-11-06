# Use Eclipse Temurin JDK 17 (Open Source Java)
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml first (for better caching)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose Eureka port
EXPOSE 8761

# Run the application
ENTRYPOINT ["java", "-jar", "target/eureka-server-1.0.0.jar"]
