## declare base image - node 16
FROM node:14.19.1-alpine3.15 AS builder
## make work directory and copy files
WORKDIR /app
COPY package*.json ./
COPY tsconfig.build.json ./
COPY . .
## project dependency install
RUN npm install
RUN npm run build

FROM node:14.19.1-alpine3.15
WORKDIR /usr/src/app
COPY --from=builder /app ./

EXPOSE 3000
CMD npm run start:dev