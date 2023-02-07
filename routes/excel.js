var express = require("express");
var router = express.Router();
const XLSX = require("xlsx");
require("../models/connection");

const Excel = require("../models/excel");

const workbook = XLSX.readFile("/Users/julienfoucart/Documents/msm.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

router.get("/", async (req, res) => {
  try {
    const data = await Excel.find();
    res.json({ result: true, data });
  } catch (err) {
    res.json({ result: false, error: err });
  }
});

module.exports = router;
