FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run generate

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/app.js"]