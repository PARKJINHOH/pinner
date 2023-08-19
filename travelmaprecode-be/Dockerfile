FROM eclipse-temurin:17.0.8_7-jre-jammy
ARG JAR_FILE=/build/libs/pinner-be.jar
COPY ${JAR_FILE} /pinner-be.jar
ENTRYPOINT ["java","-jar","/pinner-be.jar"]