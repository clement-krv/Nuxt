# syntax=docker/dockerfile:1

FROM node:22-slim

WORKDIR /app

# Install dependencies (kept in the final image so drizzle-kit can push the
# schema at container startup).
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source and build the Nuxt app.
COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
EXPOSE 3000

RUN chmod +x docker-entrypoint.sh
CMD ["sh", "docker-entrypoint.sh"]
