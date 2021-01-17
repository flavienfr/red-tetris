FROM node:alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD ["npm", "run", "start"]

# Production config

#FROM node:alpine

#WORKDIR /app

#COPY ./frontend/package.json /app

#RUN yarn install && yarn cache clean

#COPY ./frontend/ /app

#CMD ["yarn", "run", "build"]

