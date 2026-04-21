FROM node:22-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate \
    && DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run build

RUN chmod +x start.sh

EXPOSE 3000

CMD ["sh", "start.sh"]
