# Stage 1: Build dependencies
FROM debian:bookworm AS builder

# Stage 2: Final application
FROM node:20-slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* 

WORKDIR /usr/src/app

# Copy application files
COPY package*.json ./
RUN npm install --production
COPY . .

# Crear el directorio de sesión y cambiar los permisos
RUN mkdir -p /whatsapp-session && chown -R node:node /whatsapp-session && chmod -R 755 /whatsapp-session

# Expose the app port
EXPOSE 3000

# User node for security
# USER node

# Start the application
CMD ["node", "src/index.js"]