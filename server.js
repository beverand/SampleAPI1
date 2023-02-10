const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
require("dotenv").config({path: "./.env"});
const PORT = process.env.PORT || 3000

const uri = process.env.DB_STRING;
const client = new MongoClient(uri);

app.get("/questions", async (req, res) => {
    let questions = await client.connect()
    return res.json(questions)
})

client.connect(err => {
    if(err){ console.error(err); return false;}
    // connection to mongo is successful, listen for requests
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
});
