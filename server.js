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
    res.status(200).send("Backend Challenge 2021 🏅 - Covid Daily ")
})


//Listar todos os registros da base de dados no dia selecionado, agrupados por país e separados por variante.
app.get("/cases/:date/count", (req, res) => {
    const data_input = req.params.date;

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
                        variants: {
                            $push: { variant: "$variant", quantity: "$num_sequences" }
                        }
                    }
                },

                { $sort: { _id: 1 } },

            ];

            var list_of_documents = [];

            const aggCursor = collection.aggregate(pipeline);

            for await (let doc of aggCursor) {
                doc = {"location":doc._id,"variants":doc.variants}
                list_of_documents.push(doc);
            }

            res.status(200).json({ "covid_daily_cases": list_of_documents });

        } catch (err) {
            console.log(err.stack);
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
    
})


//Listar todos os registros da base de dados, retornando a soma dos casos registrados de acordo com a data selecionada, 
//agrupados por país e separados por variante.
app.get("/cases/:date/cumulative", (req, res) => {
    const data_input = req.params.date;
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
                        variants: {
                            $push: { variant: "$_id.variant", quantity: "$quantity" }
                        }
                    }
                },
                
                { $unwind: '$variants' },
                { $sort: { variants: 1 } },

                {
                    $group: {
                        _id: "$_id",
                        variants: {
                            $push: { variant: "$variants.variant", quantity: "$variants.quantity" }
                        }
                    }
                },

                { $sort: { _id: 1 } },   
                
            ];

            var list_of_documents = [];

            const aggCursor = collection.aggregate(pipeline);
            for await (let doc of aggCursor) {
                doc = { "location": doc._id, "variants": doc.variants }
                list_of_documents.push(doc);
            }

            res.status(200).json({ "covid_cumulative_cases": list_of_documents });

        } catch (err) {
            console.log(err.stack);
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
                        dates_available: { $push: "$_id" }
                    }
                },

                { $project: { _id: 0, dates_available: 1} },

            ];

            var list_of_documents = [];

            const aggCursor = collection.aggregate(pipeline);
            for await (const doc of aggCursor) {
                list_of_documents.push(doc);
            }

            res.status(200).json((list_of_documents[0]));

        } catch (err) {
            console.log(err.stack);
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);

    
})


app.listen(3333, () => {
    console.log(`Listening at http://localhost:3333`)
})

