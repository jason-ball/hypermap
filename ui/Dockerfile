FROM node:alpine as build
RUN apk add git openssh
WORKDIR /ui

COPY package.json package-lock.json ./
ENV PATH="./node_modules/.bin:$PATH"
RUN npm install
RUN ngcc

COPY . ./
RUN node --max_old_space_size=4096 ./node_modules/@angular/cli/bin/ng build --configuration=docker

FROM nginx:alpine
COPY --from=build /ui/dist/ui /usr/share/nginx/html/
