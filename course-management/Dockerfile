# Use official OpenJDK runtime as base image
FROM openjdk:17-jdk-slim

# Set working directory in container
WORKDIR /app

# Copy maven wrapper and pom.xml first (for caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (this layer will be cached)
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/course-management-0.0.1-SNAPSHOT.jar"]
