FROM node:12.18.1
COPY package.json .
RUN npm install
COPY ./src/configMongoClient.js .
COPY ./src/connectMongoClient.js .
COPY ./src/dateValidator.js .
COPY ./src/getCovidData.js .
COPY ./src/server.js .
COPY ./openapi.json .
CMD node server.js