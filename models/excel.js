const mongoose = require("mongoose");

const excelSchema = mongoose.Schema({
  designation: String,
  ref: String,
  priceM: Number,
  pricePanneau: Number,
  type: String,
});

const Excel = mongoose.model("excel", excelSchema);

module.exports = Excel;
