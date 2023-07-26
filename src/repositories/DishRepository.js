const knex = require("../database/knex");

class DishRepository {
    async createDish(imageFilename, name, category, price, description) {
        const dish = await knex("dishes").insert({
            image: imageFilename,
            name,
            category,
            price,
            description
        }).returning("*");

        return dish;
    };

    async createIngredients(ingredientsInsert) {
        await knex("ingredients").insert(ingredientsInsert);
    };

    async filterDishById(id) {
        const dish = await knex("dishes").where({ id }).first();

        return dish;
    };

    async update(dishUpdates, id) {
        await knex("dishes").update(dishUpdates).where("id", id);
    };

    async deleteIngredients(id) {
        await knex("ingredients").where("dish_id", id).del();
    };

    async filterIngredientsByDishId(id) {
        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

        return ingredients;
    };

    async deleteDish(id) {
        await knex("dishes").where({ id }).delete();
    };

    async filterDishByNameOrIngredient(itemSearch) {
        const dishes = await knex("ingredients")
            .distinct("dishes.id")
            .select([
                "dishes.id",
                "dishes.image",
                "dishes.name",
                "dishes.category",
                "dishes.price",
                "dishes.description",
            ])
            .where(function () {
                this.whereLike("dishes.name", `%${itemSearch}%`)
                    .orWhereLike("ingredients.name", `%${itemSearch}%`);
            })
            .innerJoin("dishes", "dishes.id", "ingredients.dish_id");

        return dishes;
    };

    async getAllDishes() {
        const allDishes = await knex("dishes")
            .orderBy("name");
        return allDishes;
    };

    async getAllIngredients() {
        const dishesIngredients = await knex("ingredients");

        return dishesIngredients;
    };
}

module.exports = DishRepository;