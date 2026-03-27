FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apk add --no-cache nano bash curl netcat-openbsd

COPY . .

RUN npx prisma generate

RUN chmod +x ./entrypoint.sh

EXPOSE 3333

ENTRYPOINT ["./entrypoint.sh"]