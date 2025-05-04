const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/cart.controller");
const authMiddleware = require("../../middlewares/client/auth.middlewares");

route.get('/',controller.index);

route.post('/add/:productId',authMiddleware.requireAuth,controller.addPost);

route.get('/delete/:productId',controller.delete);

route.get('/update/:productId/:quantity',controller.update);

module.exports = route; 