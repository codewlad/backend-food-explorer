const { Router } = require("express");

const usersRouter = require("./users.routes");
const adminRouter = require("./admin.routes");
const dishesRouter = require("./dishes.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/admin", adminRouter);
routes.use("/dishes", dishesRouter);

module.exports = routes;