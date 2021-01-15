FROM node:15.5.1-alpine3.10

WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .
