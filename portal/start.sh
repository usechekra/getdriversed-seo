#!/bin/sh
set -e

echo "DATABASE_URL is set: $([ -n "$DATABASE_URL" ] && echo yes || echo no)"

if echo "$DATABASE_URL" | grep -q "^postgresql\|^postgres"; then
  echo "Running prisma db push..."
  npx prisma db push
  echo "Running seed..."
  npx prisma db seed || echo "Seed skipped (already seeded)"
else
  echo "WARNING: DATABASE_URL is not a postgres URL, skipping migrations"
fi

exec npm start
