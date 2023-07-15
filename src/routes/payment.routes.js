const { Router } = require("express");

const PaymentController = require("../controllers/PaymentController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const paymentRoutes = Router();

const paymentController = new PaymentController();

paymentRoutes.get("/", ensureAuthenticated, paymentController.index);

module.exports = paymentRoutes;