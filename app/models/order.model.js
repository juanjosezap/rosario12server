const mongoose = require("mongoose");

const Order = mongoose.model(
  "order",
  new mongoose.Schema({
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
    avisos: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Aviso'
      }
    ]
  },
  { timestamps: true }
  )
);

module.exports = Order;