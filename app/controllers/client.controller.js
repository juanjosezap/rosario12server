const db = require("../models");
const Client = db.clients;

// Create and Save a new Client
exports.create = (req, res) => {
  // Validate request
    //   if (!req.body.title) {
    //     res.status(400).send({ message: "Content can not be empty!" });
    //     return;
    //   }

  // Create a Client
  const client = new Client({
    nombre: req.body.nombre,
    cuit: req.body.cuit,
    sujetoExento: req.body.sujetoExento ? req.body.sujetoExento : false,
    dir: req.body.dir,
    tel: req.body.tel,
    mail: req.body.mail,
    responsableInscripto: req.body.responsableInscripto ? req.body.responsableInscripto : false
  });

  // Save Client in the database
  client
    .save(client)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Client."
      });
    });
};

// Retrieve all Clients from the database.
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre ? { nombre: { $regex: new RegExp(nombre), $options: "i" } } : {};

  Client.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving clients."
      });
    });
};

// Find a single Client with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Client.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Client with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Client with id=" + id });
    });
};

// Update a Client by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Client.findByIdAndUpdate(id, req.body, { Octra: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Client with id=${id}. Maybe Client was not found!`
        });
      } else res.send({ message: "Client was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Client with id=" + id
      });
    });
};

// Delete a Client with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Client.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Client with id=${id}. Maybe Client was not found!`
        });
      } else {
        res.send({
          message: "Client was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Client with id=" + id
      });
    });
};

// Delete all Clients from the database.
exports.deleteAll = (req, res) => {
  Client.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Clients were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Clients."
      });
    });
};

// Find all published Clients
exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving clients."
      });
    });
};
