# --- Fase 1: Bouwen (Node) ---
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Fase 2: Serveren (Nginx) ---
FROM nginx:alpine
# Kopieer de React build naar Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Kopieer onze custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]