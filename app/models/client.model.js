const mongoose = require("mongoose");

const Client = mongoose.model(
    "client",
    new mongoose.Schema({
        nombre: String,
        cuit: String,
        dir: String,
        tel: String,
        mail: String,
        iva: String
    },
    { timestamps: true }
    )
);

module.exports = Client;