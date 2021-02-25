module.exports = app => {
    const orders = require("../controllers/order.controller.js");
  
    var router = require("express").Router();

    router.get("/getOrder/:id", orders.getOrderPdf);
    
    router.get("/getPauta", orders.getPautaPdf);

    app.use("/api/pdf", router);
  };