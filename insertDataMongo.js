const client = require("./configMongoClient.js");

const fs = require('fs');
const { parse } = require('csv-parse');

var list_of_documents = [];

var csv_parser = parse({ columns: false }, function (err, records) {

    for (var i = 1; i < records.length; i++) {

        if (records[i][2] != "non_who") {
            let document = {
                "location": records[i][0],
                "date": records[i][1],
                "variant": records[i][2],
                "num_sequences": parseInt(records[i][3]),
            }
            list_of_documents.push(document);

        }
    }

    insertData(list_of_documents);
});

fs.createReadStream('covid-variants.csv').pipe(csv_parser);

async function insertData(list_of_documents) {

    const dbName = "kaggle";
    const collectionName = "covid-daily-cases";

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.insertMany(list_of_documents);
        console.log(`${result.insertedCount} documents were inserted`);
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

