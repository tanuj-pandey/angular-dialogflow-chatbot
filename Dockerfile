FROM node:16.20-alpine
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install -g @angular/cli
RUN npm install
RUN npm run build
EXPOSE 4200
CMD [ "node", "index.js" ]
