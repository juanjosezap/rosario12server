const db = require("../models");
const Order = db.order;
const Aviso = db.aviso;
const orderPdf = require("../pdf/order");
const pautaPdf = require("../pdf/pauta");
const PDFDocument = require("pdfkit");
// Create and Save a new Order
exports.create = (req, res) => {
  // Validate request
    //   if (!req.body.title) {
    //     res.status(400).send({ message: "ontent can not be empty!" });
    //     return;C
    //   }
    let maxObj = 0;
    Order.find()
        .sort("-nro")
        .limit(1)
        .exec(function(err, maxResult){
            if (!err && maxResult.length) {
                maxObj = maxResult[0].nro;
            }
            
            // Create a Order
            const order = new Order({
                nombre: req.body.nombre,
                nro: maxObj + 1,
                col: req.body.col,
                alto: req.body.alto,
                tarifa: req.body.tarifa,
                notas: req.body.notas,
                color: req.body.color,
                medio: req.body.medio,
                avisos: req.body.avisos,
                client: req.body.client,
                createdBy: req.body.createdBy,
                updatedBy: req.body.createdBy
            });

            // Save Order in the database
            order
                .save(order)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while creating the Order."
                });
            });
        });
};

// Retrieve all Orders from the database.
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre ? { nombre: { $regex: new RegExp(nombre), $options: "i" } } : {};

  Order.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving orders."
      });
    });
};

// Find a single Order with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Order.findById(id)
    .populate('client')
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Order with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Order with id=" + id });
    });
};

// Update a Order by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Order.findByIdAndUpdate(id, req.body, { Octra: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found!`
        });
      } else res.send({ message: "Order was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Order with id=" + id
      });
    });
};

// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Order.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Order with id=${id}. Maybe Order was not found!`
        });
      } else {
        res.send({
          message: "Order was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Order with id=" + id
      });
    });
};

// Delete all Orders from the database.
exports.deleteAll = (req, res) => {
  Order.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Orders were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Orders."
      });
    });
};

// Find all published Orders
exports.findAllPublished = (req, res) => {
  Order.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving orders."
      });
  });
};


// Find all published Orders
exports.getPauta = (req, res) => {
  if (!req.query.date) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const dateFilter = new Date(req.query.date);
  Order.find({ 'avisos': { $elemMatch: { 'fecha': dateFilter } }})
    .populate('avisos')
    .populate('client')
    .populate('createdBy')
    .populate('updatedBy')
    .sort({medio: -1, 'avisos.pagina': 1, nro: 1 })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving orders."
      });
    });
};

exports.getOrderPdf = async (req, res) => {
  try {
    const id = req.params.id;

    Order.findById(id)
      .populate('client')
      .then(data => {
        
        const doc = orderPdf(data);
        
        res.setHeader("Content-disposition", `attachment; filename=ORD${data.nro}.pdf`);
        res.setHeader("Content-type", "application/pdf");
        return doc.pipe(res);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Order with id=" + id });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({error: "Could not generate Order report"});
  }
};

exports.getPautaPdf = async (req, res) => {
  if (!req.query.date) {
    return res.status(400).send({
      message: "Data can not be empty!"
    });
  }
  try {
    const dateFilter = new Date(req.query.date);
    Order.find({ 'avisos': { $elemMatch: { 'fecha': dateFilter } }})
      .populate('avisos')
      .populate('client')
      .sort({medio: -1, 'avisos.pagina': 1, nro: 1 })
      .then(data => {
        const doc = pautaPdf(data, dateFilter);
        const fecha = (dateFilter.getDate() + 1)  + '-' + (dateFilter.getMonth() + 1).toString().padStart(2, '0') + '-' +  dateFilter.getFullYear();
        res.setHeader("Content-disposition", `attachment; filename=PAUTA${fecha}.pdf`);
        res.setHeader("Content-type", "application/pdf");
        return doc.pipe(res);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving orders."
        });
      });
  } catch (error) {
    res.status(500).send({
      message: err.message || "Some error occurred. Comela."
    });
  }
};

exports.getOrders = (req, res) => {
  const { nro, desde, hasta, nombre, medio, client } = req.query;
  var query = {};
  if ( nro !== "" ) {
      query["nro"] = nro;
  }
  query["createdAt"] = {};
  if (desde !== "") {
    var desdeDate = new Date(new Date(desde));
    desdeDate.setDate(desdeDate.getDate() + 1);
    desdeDate.setHours(00, 00, 00);
    query["createdAt"].$gte = desdeDate; 
  }
  if (hasta !== "") {
    var hastaDate = new Date(new Date(hasta));
    hastaDate.setDate(hastaDate.getDate() + 1);
    hastaDate.setHours(23, 59, 59);
    query["createdAt"].$lt = hastaDate;
  }
  if (Object.keys(query["createdAt"]).length === 0) {
    delete query.createdAt;
  }    
  if ( nombre !== "") {
    query["nombre"] = { $regex: new RegExp(nombre), $options: "i" }
  }
  if ( medio !== "" ) {
      query["medio"] = medio;
  }
  if ( client !== "") {
    query["client"] =  client;
  }

  
  Order.find(query)
    .populate('avisos')
    .populate('client')
    .populate('createdBy')
    .populate('updatedBy')
    .sort({ nro: -1 })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving orders."
      });
    });
};