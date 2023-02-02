const mongoose = require("mongoose");

const devisSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  name: String,
  tel: String,
  email: String,
  adress: String,
  createdAt: Date,
  numero: Number,
});

const Devis = mongoose.model("devis", devisSchema);

module.exports = Devis;
