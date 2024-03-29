const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");

const favoritesRoutes = Router();

const favoritesController = new FavoritesController();

favoritesRoutes.post("/", favoritesController.create);
favoritesRoutes.get("/:user_id", favoritesController.index);
favoritesRoutes.delete("/:id", favoritesController.delete);
favoritesRoutes.get("/", favoritesController.show);

module.exports = favoritesRoutes;