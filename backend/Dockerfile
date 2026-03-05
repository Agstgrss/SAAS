FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apk update && apk add nano

COPY . .

RUN npx prisma generate

EXPOSE 3333

CMD ["npm", "run", "dev"]