const express = require("express");
const multer = require("multer");
const route = express.Router();
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/my-account.controller.js");

route.get("/", controller.index);

route.get("/edit", controller.edit);

route.patch("/edit", upload.single("avatar"), controller.editPatch);

module.exports = route;
