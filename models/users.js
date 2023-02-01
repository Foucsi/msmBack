const mongoose = require("mongoose");

const factureSchema = mongoose.Schema({
  numero: Number,
  date: Date,
});

const devisSchema = mongoose.Schema({
  numero: Number,
  date: Date,
});

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  profil: String,
  factures: [factureSchema], // sous-documents
  devis: [devisSchema], // sous-documents
});

const User = mongoose.model("users", userSchema);
module.exports = User;
