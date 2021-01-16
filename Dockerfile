FROM node:alpine

WORKDIR /app

COPY ./frontend/package.json /app

RUN yarn install && yarn cache clean

COPY ./frontend/ /app

CMD ["yarn", "run", "build"]
