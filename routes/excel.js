var express = require("express");
var router = express.Router();
require("../models/connection");

const Excel = require("../models/excel");

router.get("/", (req, res) => {
  Excel.find().then((data) => res.json({ result: true, data }));
});

module.exports = router;
