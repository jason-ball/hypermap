#
# Hypermap Map Dockerfile
# Jason Ball | Evan Scott | Naomi Steele | Christian Manu
#

FROM node:alpine as build
ARG SERVER_HOST
RUN apk add git openssh
WORKDIR /ui

COPY package.json package-lock.json ./
ENV PATH="./node_modules/.bin:$PATH"
RUN npm install
RUN ngcc

COPY . ./
RUN sed -i "s|<%SERVER_HOST%>|$SERVER_HOST|g" src/environments/environment.docker.ts
RUN node --max_old_space_size=4096 ./node_modules/@angular/cli/bin/ng build --configuration=docker

FROM nginx:alpine
COPY --from=build /ui/dist/ui /usr/share/nginx/html/
