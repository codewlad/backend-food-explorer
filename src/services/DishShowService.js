const AppError = require("../utils/AppError");

class DishShowService {
    constructor(dishRepository) {
        this.dishRepository = dishRepository;
    }

    async execute(id) {
        try {
            const dish = await this.dishRepository.filterDishById(id);
            const ingredients = await this.dishRepository.filterIngredientsByDishId(id);

            const dishWithIngredients = {
                ...dish,
                ingredients
            };

            return dishWithIngredients;
        } catch {
            throw new AppError("Não foi possível mostrar o prato!", 500);
        };
    };
}

module.exports = DishShowService;