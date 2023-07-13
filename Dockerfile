FROM onedio2/nvmnode
WORKDIR /usr/app
COPY ./ /usr/app
RUN nvm install 16.14.0
RUN nvm use 16.14.0
# RUN npm install -g @angular/cli
RUN npm install
RUN npm run build
EXPOSE 4200
CMD [ "node", "index.js" ]
