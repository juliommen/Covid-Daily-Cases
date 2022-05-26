FROM node:12.18.1

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY configMongoClient.js .
COPY server.js .

CMD node server.js