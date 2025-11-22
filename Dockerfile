# Etapa 1: Construcción de la aplicación React
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación para producción
# Las variables de entorno se pueden pasar en tiempo de build o runtime
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Instalar bash para el script de entrada
RUN apk add --no-cache bash

# Copiar la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el script de entrada
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copiar los archivos construidos desde la etapa de build
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Usar el script de entrada como entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
