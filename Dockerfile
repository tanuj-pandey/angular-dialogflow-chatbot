# FROM node:16.14.0

# WORKDIR /app


# COPY ./package.json .
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx as runtime
# COPY /dist /usr/share/nginx/html

FROM nginx:1.22 as test
WORKDIR /app
RUN echo '<h1>Hello world again</h1>' > index.html

FROM nginx:1.22
COPY --from=test /app/index.html /usr/share/nginx/html/
EXPOSE 8080
