FROM node:22-alpine AS build

WORKDIR /workspace

COPY services/web/package.json services/web/package-lock.json ./services/web/
RUN npm --prefix services/web ci

COPY services/web ./services/web

ARG API_BASE_URL=/api
ENV API_BASE_URL=${API_BASE_URL}
RUN npm --prefix services/web run build

FROM nginx:stable-alpine AS runtime

COPY services/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/services/web/dist/jornadas-laborales/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]