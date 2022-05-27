FROM node:12.18.1
COPY configMongoClient.js .
COPY server.js .
COPY package.json .
RUN npm install
CMD node server.js