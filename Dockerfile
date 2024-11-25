# Usar una imagen base de Node.js
FROM node:18 AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json (si está presente)
COPY package.json package-lock.json ./

# Instalar las dependencias necesarias para la aplicación
RUN npm install

# Copiar el resto de los archivos de tu aplicación al contenedor
COPY . .

# Ejecutar la construcción de la aplicación (build)
RUN npm run build

# Usar una imagen base de Nginx para servir la aplicación en producción
FROM nginx:alpine

# Copiar los archivos construidos de la fase anterior
COPY --from=build /app/build /usr/share/nginx/html

# (Opcional) Copiar archivo de configuración de Nginx si es necesario
# COPY nginx.conf /etc/nginx/nginx.conf

# Cambiar a un usuario no root (opcional, si se tienen problemas con permisos)
USER nginx

# Exponer el puerto 80 para que la app sea accesible
EXPOSE 80

# Iniciar Nginx para servir la aplicación
CMD ["nginx", "-g", "daemon off;"]
