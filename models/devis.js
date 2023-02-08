const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  product: String,
});

const devisSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  user: String,
  name: String,
  tel: String,
  email: String,
  adress: String,
  createdAt: Date,
  numero: Number,
  product: [productSchema],
});

const Devis = mongoose.model("devis", devisSchema);

module.exports = Devis;
