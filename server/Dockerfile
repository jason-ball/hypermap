#
# Hypermap Server Dockerfile
# Jason Ball | Evan Scott | Naomi Steele | Christian Manu
#

FROM maven:3-openjdk-11 AS build
WORKDIR /build

COPY pom.xml .
RUN mvn verify clean --fail-never

COPY src ./src
RUN mvn clean package -DskipTests

FROM tomcat
COPY --from=build /build/target/server.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080
