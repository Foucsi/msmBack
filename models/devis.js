const mongoose = require("mongoose");

const devisSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  content: String,
  createdAt: Date,
  numero: Number,
});

const Devis = mongoose.model("devis", devisSchema);

module.exports = Devis;
