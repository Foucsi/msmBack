var express = require("express");
var router = express.Router();
require("../models/connection");
var MongoClient = require("mongodb").MongoClient;
const connectionString = process.env.CONNECTION_DB;

router.get("/", async (req, res) => {
  const client = await MongoClient.connect(connectionString);
  const db = client.db("msm");
  try {
    const data = await db.collection("excel").find().toArray();
    res.json({ result: true, data });
  } catch (err) {
    throw err;
  } finally {
    client.close();
  }
});

module.exports = router;
