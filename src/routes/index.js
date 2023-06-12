const { Router } = require("express");

const usersRouter = require("./users.routes");
const adminRouter = require("./admin.routes");
const dishesRouter = require("./dishes.routes");
const ordersRouter = require("./orders.routes");
const favoritesRouter = require("./favorites.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/admin", adminRouter);
routes.use("/dishes", dishesRouter);
routes.use("/orders", ordersRouter);
routes.use("/favorites", favoritesRouter);

module.exports = routes;