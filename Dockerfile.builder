# IMAGE NAME: tracks-fe:221021
FROM node:18.7.0

RUN mkdir -p /app/frontend
WORKDIR /app/frontend

COPY ./package*.json ./
COPY ./.npmrc ./


RUN npm install --ignore-scripts
