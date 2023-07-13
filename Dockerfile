# FROM node:16.3.0-alpine as build
# WORKDIR /app

# RUN npm install -g @angular/cli

# COPY ./package.json .
# RUN npm install
# COPY . .
# RUN npm run build

FROM nginx as runtime
COPY /dist /usr/share/nginx/html