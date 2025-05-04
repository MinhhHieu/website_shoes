const express = require("express");
const route = express.Router();

const controller = require("../../controllers/admin/dashboard.controller.js");

route.get('/',controller.dashboard);

module.exports = route; 