FROM node:24-alpine


ARG MODE=""

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

RUN npm run build${MODE}