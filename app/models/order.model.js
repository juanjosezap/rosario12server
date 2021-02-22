const mongoose = require("mongoose");

const Aviso = new mongoose.Schema({
  fecha: Date,
  pagina: Number
})

const Order = new mongoose.Schema({
    nombre: String,
    nro: Number,
    col: Number,
    alto: Number,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "client"
    },
    tarifa: Number,
    notas: String,
    color: Boolean,
    avisos: [Aviso]
  },
  { timestamps: true }
  );

module.exports = mongoose.model("order", Order);