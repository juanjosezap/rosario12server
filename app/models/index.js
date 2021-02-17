const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorials = require("./tutorial.model");
db.clients = require("./client.model");
db.user = require("./user.model");
db.role = require("./role.model");
db.order = require("./order.model");
db.aviso = require("./aviso.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
