const knex = require("../database/knex");

class FavoriteRepository {
    async create(userId, dishId) {
        await knex("favorites").insert({ user_id: userId, dish_id: dishId });
    };

    async showAllFavorites() {
        const allFavorites = await knex.select("*").from("favorites");

        return allFavorites;
    };

    async filterFavoritesByUserId(id) {
        const userFavorites = await knex("favorites")
            .select("favorites.id", "favorites.dish_id", "dishes.image", "dishes.name")
            .join("dishes", "favorites.dish_id", "dishes.id")
            .where("favorites.user_id", id);

        return userFavorites;
    };

    async delete(id) {
        await knex("favorites").where({ id }).delete();
    };
}

module.exports = FavoriteRepository;