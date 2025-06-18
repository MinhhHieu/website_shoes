const express = require("express");
const multer  = require('multer');
const route = express.Router();
// const storageMulter = require("../../helpers/storageMulter");
const upload = multer();

const controller = require("../../controllers/admin/account.controller.js");

const validate = require("../../validates/admin/account.validate.js");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares.js");

route.get('/',controller.index);

route.get('/create',controller.create);

route.post(
    '/create',
    upload.single('avatar'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost);

route.get('/edit/:id',controller.edit);

route.patch(
    '/edit/:id',
    upload.single('avatar'),
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch);

route.get('/detail/:id',controller.detail);

module.exports = route; 