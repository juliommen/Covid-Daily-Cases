FROM node:12.18.1
COPY package.json .
RUN npm install
COPY ./src/configMongoClient.js .
COPY ./openapi.json .
COPY ./src/server.js .
CMD node server.js