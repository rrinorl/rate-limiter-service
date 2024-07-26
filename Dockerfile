FROM node:16.3.0 AS base
LABEL description="rate-limiter-service Description tbd..."

WORKDIR /home/node/app

#Copy and install dependencies

COPY package*.json  ./
COPY config.json ./

RUN npm i

#Copy project files except those listed in .dockerignore

COPY . .


#Production steps
FROM base as production

ENV NODE_PATH=./build

RUN npm run build

