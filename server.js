const express = require('express');
const app = new express();
const client = require("./configMongoClient.js");
const cors_app = require('cors');
app.use(cors_app());

const dbName = "kaggle";
const collectionName = "covid-daily-cases";

app.set('json spaces', 2)

//Retornar um Status: 200 e uma Mensagem "Backend Challenge 2021 🏅 - Covid Daily Cases"
app.get("/", (req, res) => {
    res.status(200).send({status:200,msg: "Backend Challenge 2021 🏅 - Covid Daily "})
})


//Listar todos os registros da base de dados no dia selecionado, agrupados por país e separados por variante.
app.get("/cases/:date/count", (req, res) => {
    const data_input = req.params.date;

    if (!dateValidator(data_input)) {
        res.status(500).json({ "status": 500, "error_msg": "Incorrect date input. Use this format: 'yyyy-mm-dd'."  });
        return;
    }

    async function run() {
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
                res.status(500).json({ "status": 500, "error_msg": "No data found until this particular date. Find available dates accessing the route '/dates'." });
                return;
            } 

            res.status(200).json({ "date": data_input,"covid_daily_cases": list_of_documents });
           
        } catch (err) {
            res.status(400).json({ "status": 400, "error_msg":"Could not connect to the database."});
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
    
})


//Listar todos os registros da base de dados, retornando a soma dos casos registrados até a data selecionada, 
//agrupados por país e separados por variante.
app.get("/cases/:date/cumulative", (req, res) => {
    const data_input = req.params.date;

    if (!dateValidator(data_input)) {
        res.status(500).json({ "status": 500, "error_msg": "Incorrect date input. Use this format: 'yyyy-mm-dd'." });
        return;
    }

    async function run() {
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

            res.status(200).json({ "date": data_input, "covid_accumulated_cases": list_of_documents });
            
        } catch (err) {
            res.status(400).json({ "status": 400, "error_msg": "Could not connect to the database." });
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
})


//Listar as datas disponíveis no dataset
app.get("/dates", (req, res) => {

    async function run() {
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

            res.status(200).json((list_of_documents[0]));

        } catch (err) {
            res.status(400).json({ "status": 400, "error_msg": "Could not connect to the database." });
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);

    
})


app.listen(8080, () => {
    console.log(`Listening at http://localhost:8080`)
})


function dateValidator(date) {

    var date_check = new Date(parseInt(date.slice(0, 4)), parseInt(date.slice(5, 7)) - 1, parseInt(date.slice(8)));
    date_check = date_check.toISOString().slice(0, 10)

    if (date_check == date) {
        return true;
    }

    return false;
}

