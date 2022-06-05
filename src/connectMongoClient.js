const client = require("./configMongoClient.js");

module.exports = async function () {
    try {
        await client.connect();
        return client;
    } catch (err) {
        return null;
    }
}