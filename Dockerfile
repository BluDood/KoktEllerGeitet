FROM node:lts-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

WORKDIR /app/web
COPY web/package.json web/package-lock.json ./
RUN npm ci

WORKDIR /app
COPY . .

RUN npx prisma generate
RUN npm run build

WORKDIR /app/web
RUN npm run build

WORKDIR /app

CMD npx prisma db push && npm start