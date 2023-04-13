FROM gradle:7.3.3-jdk17 AS build
WORKDIR /app
COPY --chown=gradle:gradle . .
RUN gradle build --no-daemon


FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]