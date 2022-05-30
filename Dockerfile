FROM node:12.18.1
COPY ./src/configMongoClient.js .
COPY ./src/server.js .
COPY package.json .
RUN npm install
CMD node server.js