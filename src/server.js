const express = require('express');
const app = new express();
const connect = require("./connectMongoClient.js");
const getCovidData = require("./getCovidData.js");
const dateValidator = require("./dateValidator.js");
const cors_app = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../openapi.json');

app.use(cors_app());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.set('json spaces', 2)

var cache = {};
var list_of_documents = [];

app.get("/", (req, res) => {
    return res.status(200).send({
        status: 200,
        msg: "Backend Challenge 2022 🏅 - Covid Daily Cases"
    })
})

app.get("/cases/:date/count", (req, res) => {

    const data_input = req.params.date;

    if (!dateValidator(data_input)) {
        return res.status(400).json({
            "status": 400,
            "error_msg": "Invalid date input. Use this format: 'yyyy-mm-dd'."
        });
    }

    if (cache["/cases/+" + data_input + "/count"] != undefined) {
        return res.status(200).json({
            "date": data_input,
            "covid_daily_cases": cache["/cases/+" + data_input + "/count"]
        });
    }

    async function run() {
        const client = await connect();

        if (client == null) {
            return res.status(500).json({
                "status": 500,
                "error_msg": "Could not connect to the database."
            });
        } else {
            list_of_documents = await getCovidData.getDataCount(client, data_input);

            if (list_of_documents.length == 0) {
                return res.status(404).json({
                    "status": 404,
                    "error_msg": "No data found for this particular date. Find available dates accessing the route '/dates'."
                });
            }

            cache["/cases/+" + data_input + "/count"] = list_of_documents;
            await client.close();
            return res.status(200).json({ "date": data_input, "covid_daily_cases": list_of_documents });
        }    
    }

    run();
    
})

app.get("/cases/:date/cumulative", (req, res) => {

    const data_input = req.params.date;

    if (!dateValidator(data_input)) {
        return res.status(400).json({
            "status": 400,
            "error_msg": "Invalid date input. Use this format: 'yyyy-mm-dd'."
        });
    }

    if (cache["/cases/+" + data_input + "/cumulative"] != undefined) {
        return res.status(200).json({
            "date": data_input,
            "covid_accumulated_cases": cache["/cases/+" + data_input + "/cumulative"]
        });
    }


    async function run() {
        const client = await connect();

        if (client == null) {
            return res.status(500).json({
                "status": 500,
                "error_msg": "Could not connect to the database."
            });
        } else {
            list_of_documents = await getCovidData.getDataCumulative(client, data_input);

            if (list_of_documents.length == 0) {
                return res.status(404).json({
                    "status": 404,
                    "error_msg": "No data found until this particular date. Find available dates accessing the route '/dates'."
                });
            }

            cache["/cases/+" + data_input + "/cumulative"] = list_of_documents;
            await client.close();
            return res.status(200).json({ "date": data_input, "covid_accumulated_cases": list_of_documents });
        }
    }

    run();
})

app.get("/dates", (req, res) => {

    if (cache["/dates"] != undefined) {
        return res.status(200).json(cache["/dates"]);
    }

    async function run() {
        const client = await connect();

        if (client == null) {
            return res.status(500).json({
                "status": 500,
                "error_msg": "Could not connect to the database."
            });
        } else {
            list_of_dates = await getCovidData.getDates(client);
            cache["/dates"] = list_of_dates[0];
            await client.close();
            return res.status(200).json(list_of_dates[0]);
        }
    }

    run();    
})

app.listen(8080, () => {
    console.log(`Listening at http://localhost:8080`)
})




