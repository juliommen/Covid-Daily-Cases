const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
dotenv.config()

const mongo_user = process.env.MONGO_USER
const mongo_password = process.env.MONGO_PASSWORD

const uri = "mongodb+srv://" + mongo_user+":" + mongo_password + "@cluster0.5agzqb6.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
module.exports = client;

