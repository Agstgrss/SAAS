FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apk add --no-cache nano

COPY . .

RUN npx prisma generate

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3333

CMD ["./entrypoint.sh"]