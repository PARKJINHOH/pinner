FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x ./gradlew && ./gradlew bootJar --no-daemon -x test

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S pinner && adduser -S pinner -G pinner
COPY --from=build /app/build/libs/*.jar app.jar
RUN mkdir -p /home/app/pinner/uploads && chown -R pinner:pinner /home/app/pinner
USER pinner
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
