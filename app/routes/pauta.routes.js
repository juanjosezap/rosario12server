module.exports = app => {
    const orders = require("../controllers/order.controller.js");
  
    var router = require("express").Router();

    // La Pauta
    router.get("/", orders.getPauta);

    app.use("/api/pauta", router);
  };