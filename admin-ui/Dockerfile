#
# Hypermap AdminUI Dockerfile
# Jason Ball | Evan Scott | Naomi Steele | Christian Manu
#

FROM node:alpine as build

ARG API_KEY
ARG SERVER_HOST
ARG USERNAME
ARG PASSWORD

RUN apk add git openssh sed apache2-utils

WORKDIR /admin-ui
COPY package.json package-lock.json ./
ENV PATH="./node_modules/.bin:$PATH"
RUN npm install
RUN ngcc

COPY . ./
RUN sed -i "s|<%SERVER_HOST%>|$SERVER_HOST|g" src/environments/environment.docker.ts
RUN sed -i "s|<%API_KEY%>|$API_KEY|g" src/environments/environment.docker.ts
RUN node --max_old_space_size=4096 ./node_modules/@angular/cli/bin/ng build --configuration=docker

RUN htpasswd -bc ./htpasswd $USERNAME $PASSWORD

FROM nginx:alpine
COPY --from=build /admin-ui/dist/admin-ui /usr/share/nginx/html/
COPY --from=build /admin-ui/htpasswd /
