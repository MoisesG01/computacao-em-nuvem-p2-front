# Estágio 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Argumento para a URL da API
ARG REACT_APP_API_URL=https://alunos-api-moises.azurewebsites.net

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Definir variável de ambiente para o build
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build da aplicação
RUN npm run build

# Estágio 2: Produção com Nginx
FROM nginx:alpine

# Copiar build do estágio anterior
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

