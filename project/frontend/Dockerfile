FROM node:13.8.0-alpine3.11 AS build

RUN apk add python make gcc g++

WORKDIR /home/frontend

COPY package*.json /home/frontend/

RUN npm ci --quiet

COPY src/ /home/frontend/src/
COPY public/ /home/frontend/public/

COPY *.js* /home/frontend/

RUN npm run build

FROM nginx:latest

COPY --from=build /home/frontend/dist /frontend/