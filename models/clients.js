const mongoose = require("mongoose");

const devisSchema = mongoose.Schema({
  devis: [
    {
      user: String,
      articles: String,
      longueur: String,
      largeur: String,
      epaisseur: String,
      hauteur: String,
      profondeur: String,
    },
  ],
});

const factureSchema = mongoose.Schema({
  facture: String,
});

const clientsSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  user: String,
  name: String,
  tel: String,
  email: String,
  adress: String,
  createdAt: Date,
  devis: [devisSchema],
  facture: [factureSchema],
});

const Clients = mongoose.model("clients", clientsSchema);
module.exports = Clients;
