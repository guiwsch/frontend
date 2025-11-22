# Dockerfile para Frontend React
FROM node:18-alpine as build

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia código da aplicação
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção com nginx
FROM nginx:alpine

# Copia build para nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe porta
EXPOSE 80

# Comando padrão do nginx
CMD ["nginx", "-g", "daemon off;"]
