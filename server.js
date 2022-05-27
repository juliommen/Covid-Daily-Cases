const express = require('express');
const app = new express();
const client = require("./configMongoClient.js");
const cors_app = require('cors');
app.use(cors_app());

const dbName = "kaggle";
const collectionName = "covid-daily-cases";

const cache = {};

app.set('json spaces', 2)

app.get("/", (req, res) => {
    res.status(200).send({status:200,msg: "Backend Challenge 2022 🏅 - Covid Daily "})
})


app.get("/cases/:date/count", (req, res) => {
    const data_input = req.params.date;

    if (!dateValidator(data_input)) {
        res.status(500).json({ "status": 500, "error_msg": "Invalid date input. Use this format: 'yyyy-mm-dd'."  });
        return;
    }

    if (cache["/cases/+" + data_input + "/count"] != undefined) {
        res.status(200).json({ "date": data_input, "covid_daily_cases": cache["/cases/+" + data_input + "/count"] });
        return;
    }

    async function getData() {
        try {
            await client.connect();

            const database = client.db(dbName);
            const collection = database.collection(collectionName);

            const pipeline = [

                { $match: { date: data_input } },
          
                {
                    $group: {
                        _id: "$location",
                        cases: {
                            $push: { variant: "$variant", quantity: "$num_sequences" }
                        }
                    }
                },

                { $sort: { _id: 1 } },

            ];

            var list_of_documents = [];

            const aggCursor = collection.aggregate(pipeline);

            for await (let doc of aggCursor) {
                doc = {"location":doc._id,"cases":doc.cases}
                list_of_documents.push(doc);
            }

            if (list_of_documents.length == 0) {
                res.status(500).json({ "status": 500, "error_msg": "No data found for this particular date. Find available dates accessing the route '/dates'." });
                return;
            } 

            cache["/cases/+" + data_input + "/count"] = list_of_documents;

            res.status(200).json({ "date": data_input,"covid_daily_cases": list_of_documents });
           
        } catch (err) {
            res.status(400).json({ "status": 400, "error_msg":"Could not connect to the database."});
        } finally {
            await client.close();
        }
    }

    getData();
    
})


app.get("/cases/:date/cumulative", (req, res) => {
    const data_input = req.params.date;

    if (!dateValidator(data_input)) {
        res.status(500).json({ "status": 500, "error_msg": "Invalid date input. Use this format: 'yyyy-mm-dd'." });
        return;
    }

    if (cache["/cases/+" + data_input + "/cumulative"] != undefined) {
        res.status(200).json({ "date": data_input, "covid_accumulated_cases": cache["/cases/+" + data_input + "/cumulative"] });
        return;
    }

    async function getData() {
        try {
            await client.connect();

            const database = client.db(dbName);
            const collection = database.collection(collectionName);

            const pipeline = [
     
                { $match: { date: { $lte: data_input } } },

                {
                    $group: {
                        _id: { location: "$location", variant:"$variant" },
                        quantity: {$sum: "$num_sequences"}
                    }
                },
                {
                    $group: {
                        _id: "$_id.location",
                        cases: {
                            $push: { variant: "$_id.variant", quantity: "$quantity" }
                        }
                    }
                },
                
                { $unwind: '$cases' },
                { $sort: { cases: 1 } },

                {
                    $group: {
                        _id: "$_id",
                        cases: {
                            $push: { variant: "$cases.variant", quantity: "$cases.quantity" }
                        }
                    }
                },

                { $sort: { _id: 1 } },   
                
            ];

            var list_of_documents = [];

            const aggCursor = collection.aggregate(pipeline);
            for await (let doc of aggCursor) {
                doc = { "location": doc._id, "cases": doc.cases }
                list_of_documents.push(doc);
            }

            if (list_of_documents.length == 0) {
                res.status(500).json({ "status": 500, "error_msg": "No data found until this particular date. Find available dates accessing the route '/dates'." });
                return;
            }

            cache["/cases/+" + data_input + "/cumulative"] = list_of_documents;

            res.status(200).json({ "date": data_input, "covid_accumulated_cases": list_of_documents });
            
        } catch (err) {
            res.status(400).json({ "status": 400, "error_msg": "Could not connect to the database." });
        } finally {
            await client.close();
        }
    }

    getData();
})


app.get("/dates", (req, res) => {

    if (cache["/dates"] != undefined) {
        res.status(200).json(cache["/dates"]);
        return;
    }

    async function getData() {
        try {
            await client.connect();

            const database = client.db(dbName);
            const collection = database.collection(collectionName);

            const pipeline = [

                {
                    $group: {
                        _id: "$date",
                        quantity: { $sum: "$num_sequences" }
                    }
                },

                { $sort: { _id: 1 } },

                {
                    $group: {
                        _id: null,
                        available_dates: { $push: "$_id" }
                    }
                },

                { $project: { _id: 0, available_dates: 1} },

            ];

            var list_of_documents = [];

            const aggCursor = collection.aggregate(pipeline);
            for await (const doc of aggCursor) {
                list_of_documents.push(doc);
            }

            cache["/dates"] = list_of_documents[0];

            res.status(200).json(list_of_documents[0]);

        } catch (err) {
            res.status(400).json({ "status": 400, "error_msg": "Could not connect to the database." });
        } finally {
            await client.close();
        }
    }

    getData();

    
})


app.listen(8080, () => {
    console.log(`Listening at http://localhost:8080`)
})


function dateValidator(date) {

    if (date.length != 10) {
        return false;
    }

    var date_check = new Date(parseInt(date.slice(0, 4)), parseInt(date.slice(5, 7)) - 1, parseInt(date.slice(8)));
    date_check = date_check.toISOString().slice(0, 10)

    if (date_check == date) {
        return true;
    }

    return false;
}



