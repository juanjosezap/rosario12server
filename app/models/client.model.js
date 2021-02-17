const mongoose = require("mongoose");

const Client = mongoose.model(
    "client",
    new mongoose.Schema({
        nombre: String,
        cuit: String,
        sujetoExento: Boolean,
        dir: String,
        tel: String,
        mail: String
    },
    { timestamps: true }
    )
);

module.exports = Client;