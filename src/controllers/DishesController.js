const DishRepository = require("../repositories/DishRepository");
const DishCreateService = require("../services/DishCreateService");
const DishUpdateService = require("../services/DishUpdateService");
const DishShowService = require("../services/DishShowService");
const DishDeleteService = require("../services/DishDeleteService");
const DishIndexService = require("../services/DishIndexService");

const dishRepository = new DishRepository();

class DishesController {
    async create(req, res) {
        const { name, category, price, description, ingredients } = req.body;

        const dishCreateService = new DishCreateService(dishRepository);

        const response = await dishCreateService.execute(name, category, price, description, ingredients, req);

        return res.status(201).json(response);
    };

    async update(req, res) {
        const { id } = req.params;
        const { name, category, price, description, ingredients, removeDishImage } = req.body;

        const dishUpdateService = new DishUpdateService(dishRepository);

        const response = await dishUpdateService.execute(id, name, category, price, description, ingredients, removeDishImage, req);

        return res.status(200).json(response);
    };

    async show(req, res) {
        const { id } = req.params;

        const dishShowService = new DishShowService(dishRepository);

        const dishWithIngredients = await dishShowService.execute(id);

        return res.status(200).json(dishWithIngredients);
    };

    async delete(req, res) {
        const { id } = req.params;

        const dishDeleteService = new DishDeleteService(dishRepository);

        const response = await dishDeleteService.execute(id);

        return res.status(200).json(response);
    };

    async index(req, res) {
        const { itemSearch } = req.query;

        const dishIndexService = new DishIndexService(dishRepository);

        const dishWithIngredients = await dishIndexService.execute(itemSearch);

        return res.status(200).json(dishWithIngredients);
    };
}

module.exports = DishesController;