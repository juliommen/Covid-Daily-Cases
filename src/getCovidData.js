const connect = require("./connectMongoClient.js");

const dbName = "kaggle";
const collectionName = "covid-daily-cases";

module.exports.getDataCount = async function (client, data_input) {
    
    if (client != null) {        
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
        return await fetchListOfDocs(client, pipeline);
    }
    
}

module.exports.getDataCumulative = async function (client, data_input) {

    if (client != null) {
        const pipeline = [
            { $match: { date: { $lte: data_input } } },
            {
                $group: {
                    _id: { location: "$location", variant: "$variant" },
                    quantity: { $sum: "$num_sequences" }
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
        return await fetchListOfDocs(client, pipeline);
    }

}

module.exports.getDates = async function (client) {

    if (client != null) {
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
            { $project: { _id: 0, available_dates: 1 } },
        ];
        return await fetchListOfDocs(client, pipeline, true);
    }

}

async function fetchListOfDocs(client, pipeline, getDates = false) {
    const collection = client.db(dbName).collection(collectionName);
    const aggCursor = collection.aggregate(pipeline);
    var list_of_documents = [];
    for await (let doc of aggCursor) {
        if (!getDates) doc = { "location": doc._id, "cases": doc.cases };
        list_of_documents.push(doc);
    }
    return list_of_documents;
}