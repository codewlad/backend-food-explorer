const AppError = require("../utils/AppError");

class DishIndexService {
    constructor(dishRepository) {
        this.dishRepository = dishRepository;
    }

    async execute(itemSearch) {
        try {
            let dishes;

            if (itemSearch) {
                dishes = await this.dishRepository.filterDishByNameOrIngredient(itemSearch);

            } else {
                dishes = await this.dishRepository.getAllDishes();
            };

            const dishesIngredients = await this.dishRepository.getAllIngredients();

            const dishesWithIngredients = dishes.map(dish => {
                const dishIngredients = dishesIngredients.filter(ingredient => ingredient.dish_id === dish.id);

                return {
                    ...dish,
                    ingredients: dishIngredients
                };
            });

            return dishesWithIngredients;
        } catch {
            throw new AppError("Não foi possível realizar a busca.", 500);
        };
    };
}

module.exports = DishIndexService;