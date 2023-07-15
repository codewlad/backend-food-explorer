const { Router } = require("express");

const usersRouter = require("./users.routes");
const adminRouter = require("./admin.routes");
const dishesRouter = require("./dishes.routes");
const ordersRouter = require("./orders.routes");
const favoritesRouter = require("./favorites.routes");
const sessionsRouter = require("./sessions.routes");
const paymentRouter = require("./payment.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/admin", adminRouter);
routes.use("/dishes", dishesRouter);
routes.use("/orders", ordersRouter);
routes.use("/favorites", favoritesRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/payment", paymentRouter);

module.exports = routes;