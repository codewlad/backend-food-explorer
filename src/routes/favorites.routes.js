const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");

const favoritesRoutes = Router();

const favoritesController = new FavoritesController();

favoritesRoutes.post("/", favoritesController.create);

module.exports = favoritesRoutes;