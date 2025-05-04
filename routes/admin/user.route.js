const express = require("express");
const route = express.Router();

const controller = require("../../controllers/admin/user.controller.js");

route.get('/',controller.index);

module.exports = route; 