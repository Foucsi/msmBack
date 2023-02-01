const mongoose = require("mongoose");

const facturesSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  content: String,
  createdAt: Date,
  numero: Number,
});

const Factures = mongoose.model("factures", facturesSchema);

module.exports = Factures;
