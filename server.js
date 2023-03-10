const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config({path: "./.env"});
const PORT = process.env.PORT || 3000;

const uri = process.env.DB_STRING;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology:true});

client.connect(err => {
    if(err){ console.error(err); return false;}
    // connection to mongo is successful, listen for requests
    app.listen(PORT, () => {
        console.log(`listening for requests on ${PORT}`);
    })
});

app.use(cors());

app.get("/questions", async (req, res) => {
   //all questions
   let questions = await client.db("DailyDev")
                               .collection("questions")
                               .find({})
                               .project({ question:1, qtype:1, _id:0 })
                               .toArray();
   if(questions){
     res.json(questions);
   } else {
     res.sendStatus(404);
   }  
});

app.get("/questions/qtype", async (req, res) => {
  //get all questions in one type
  let types = await client.db("DailyDev")
                        .collection("questions")
                        .aggregate([
                           {
                              '$group': {
                                 '_id': '$qtype'
                               }
                           }
                         ])
                        .toArray(); 
  if(types){
    res.json(types);
  } else {
    res.sendStatus(404);
  }
})

app.get("/questions/qtype/:qtype", async (req, res) => {
  //get all questions in one type
  const { qtype } = req.params;
    let questions = await client.db("DailyDev")
                        .collection("questions")
                        .find({qtype:qtype})
                        .project({ question:1, qtype:1, _id:0 })
                        .toArray();
  if(questions){
    res.json(questions);
  } else {
    res.sendStatus(404);
  }
})

app.get("/questions/qsearch/:search", async (req, res) => {
  //get all questions that contain search criteria
  const { search } = req.params;
  let questions = await client.db("DailyDev")
                        .collection("questions")
                        .find({question:new RegExp('.*' + search + '.*')}).project({ question:1, qtype:1, _id:0 }).toArray();

  if(questions){
    res.json(questions);
  } else {
    res.sendStatus(404);
  }
})

app.get("/questions/:qid", async (req, res) => {
  //get single question by id 
  const {  qid } = req.params;
  let questions = await client.db("DailyDev")
                        .collection("questions")
                        .aggregate([
                           {
                              '$match': {
                                 'questions._id': new ObjectId(qid)
                               }
                           }
                         ])
                        .toArray();
 if(questions){
    res.json(questions);
  } else {
    res.sendStatus(404);
  }
})

app.get("/questions/qsamp/:qcount", async (req, res) => {
  //get single question by id 
  const {  qcount } = req.params;
  qcount > 150 || qcount < 1 ? qcount = 1 : qcount 
  let questions = await client.db("DailyDev")
                        .collection("questions")
                        .aggregate([ { $sample: { size: Number(qcount)} } ])
                        .toArray();
 if(questions){
    res.json(questions);
  } else {
    res.sendStatus(404);
  }
})
