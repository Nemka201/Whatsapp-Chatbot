# Etapa 1: Construcción de la aplicación React
FROM node:18 as builder

WORKDIR /app

# Copiar los archivos del proyecto
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir los archivos estáticos con nginx
FROM nginx:stable-alpine

# Copiar los archivos compilados al directorio donde nginx sirve el contenido estático
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar configuración de nginx si es necesario (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Comando de inicio de nginx
CMD ["nginx", "-g", "daemon off;"]
