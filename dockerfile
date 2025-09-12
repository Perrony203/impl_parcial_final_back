# Usar Node LTS
FROM node:22

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json primero (mejor cache de dependencias)
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando de arranque
ENTRYPOINT ["node", "server.js"]