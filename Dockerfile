## declare base image - node 16
FROM node:14.19.1-alpine3.15 AS builder

# Korean Fonts
RUN apk --update add fontconfig
RUN mkdir -p /usr/share/fonts/nanumfont
RUN wget http://cdn.naver.com/naver/NanumFont/fontfiles/NanumFont_TTF_ALL.zip
RUN unzip NanumFont_TTF_ALL.zip -d /usr/share/fonts/nanumfont
RUN fc-cache -f && rm -rf /var/cache/*

# bash install
RUN apk add bash

# Language
ENV LANG=ko_KR.UTF-8 \
    LANGUAGE=ko_KR.UTF-8

# Set the timezone in docker
RUN apk --no-cache add tzdata && \
        cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
        echo "Asia/Seoul" > /etc/timezone

## make work directory and copy files
WORKDIR /app
COPY package*.json ./

## project dependency install
RUN npm install

# wait-for-it.sh
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

COPY . .

COPY .eslintrc.js nest-cli.json tsconfig.json tsconfig.build.json ./
RUN npm run build

FROM node:14.19.1-alpine3.15
WORKDIR /usr/src/app
COPY --from=builder /app ./

RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ./docker-entrypoint.sh

EXPOSE 3321