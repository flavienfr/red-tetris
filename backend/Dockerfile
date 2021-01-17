FROM node:alpine

WORKDIR /usr/app
COPY package*.json ./
RUN npm install --silent
COPY . .

#CMD ["npm", "run", "dev"]