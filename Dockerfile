FROM node:20 AS build
ENV NODE_OPTIONS=--max_old_space_size=4096

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN mkdir -p /wcr-front
WORKDIR /wcr-front
COPY package*.json ./

RUN npm install -g @angular/cli
RUN npm install -g @angular-devkit/build-angular

RUN npm install --legacy-peer-deps

RUN useradd docker
USER docker

EXPOSE 4200
