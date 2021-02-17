const mongoose = require("mongoose");

const Aviso = mongoose.model(
  "Aviso",
  new mongoose.Schema({
    fecha: Date,
    pagina: Number
  })
);

module.exports = Aviso;