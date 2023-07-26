const FavoriteRepository = require("../repositories/FavoriteRepository");
const FavoriteCreateService = require("../services/FavoriteCreateService");
const FavoriteShowService = require("../services/FavoriteShowService");
const FavoriteIndexService = require("../services/FavoriteIndexService");
const FavoriteDeleteService = require("../services/FavoriteDeleteService");

const favoriteRepository = new FavoriteRepository();

class FavoritesController {
    async create(req, res) {
        const { userId, dishId } = req.body;

        const favoriteCreateService = new FavoriteCreateService(favoriteRepository);

        const response = await favoriteCreateService.execute(userId, dishId);

        return res.status(201).json(response);
    };

    async show(req, res) {
        const favoriteShowService = new FavoriteShowService(favoriteRepository);

        const allFavorites = await favoriteShowService.execute();

        return res.status(200).json(allFavorites);
    };

    async index(req, res) {
        const { user_id } = req.params;

        const favoriteIndexService = new FavoriteIndexService(favoriteRepository);

        const userFavorites = await favoriteIndexService.execute(user_id);

        return res.status(200).json(userFavorites);
    };

    async delete(req, res) {
        const { id } = req.params;

        const favoriteDeleteService = new FavoriteDeleteService(favoriteRepository);

        const response = await favoriteDeleteService.execute(id);

        return res.status(200).json(response);
    };
}

module.exports = FavoritesController;