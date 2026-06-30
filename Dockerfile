FROM mcr.microsoft.com/playwright:v1.61.1-noble

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV VEXA_HOST=0.0.0.0
ENV VEXA_API_PORT=8080
ENV VEXA_SANDBOX_ORIGIN=http://127.0.0.1:8080

EXPOSE 8080

CMD ["npm", "start"]
