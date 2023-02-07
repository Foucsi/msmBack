var express = require("express");
var router = express.Router();
require("../models/connection");
var MongoClient = require("mongodb").MongoClient;
const connectionString = process.env.CONNECTION_DB;

MongoClient.connect(connectionString, (err, client) => {
  if (err) throw err;
  const db = client.db("msm");

  router.get("/", (req, res) => {
    db.collection("excel")
      .find()
      .toArray((err, data) => {
        if (err) throw err;
        res.json({ result: true, data });
      });
  });
});

module.exports = router;
