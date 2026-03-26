#!/bin/sh
set -e

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}

echo "Esperando o Postgres em $DB_HOST:$DB_PORT..."

while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "Postgres disponível! Rodando migrations..."
npx prisma migrate deploy

echo "Iniciando backend..."
npm run dev