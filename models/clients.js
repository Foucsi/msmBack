const mongoose = require("mongoose");

const clientsSchema = mongoose.Schema({
  name: String,
  tel: String,
  email: String,
  adress: String,
});

const Clients = mongoose.model("clients", clientsSchema);
module.exports = Clients;
