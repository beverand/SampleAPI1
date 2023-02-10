const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
require("dotenv").config({path: "./.env"});
const PORT = process.env.PORT || 3000

const uri = process.env.DB_STRING;
const client = new MongoClient(uri);

client.connect(err => {
    if(err){ console.error(err); return false;}
    // connection to mongo is successful, listen for requests
    app.listen(PORT, () => {
        console.log(`listening for requests on ${PORT}`);
    })
});

app.get("/questions", async (req, res) => {
   let questions = await client.db("DailyDev")
                               .collection("questions")
                               .find({})
                               .project({ question:1, qtype:1, _id:0 }).toArray();

   if(questions){
     res.json(questions);
   } else {
     res.sendStatus(404);
   }  
})
