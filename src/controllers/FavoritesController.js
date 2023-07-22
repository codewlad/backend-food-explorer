const knex = require("../database/knex");

class FavoritesController {
    async create(req, res) {
        const { user_id, dish_id } = req.body;

        const [checkIfIsFavorite] = await knex("favorites").where("dish_id", dish_id);

        if (checkIfIsFavorite) {
            await knex("favorites").where("id", checkIfIsFavorite.id).delete();
            return res.json({ success: "Removido dos favoritos.", favorite: false });
        }

        await knex("favorites").insert({
            user_id,
            dish_id
        })

        return res.json({ success: "Adicionado aos favoritos.", favorite: true });
    }

    async index(req, res) {
        const { user_id } = req.params;

        const userFavorites = await knex('favorites')
            .select('favorites.id', 'favorites.dish_id', 'dishes.image', 'dishes.name')
            .join('dishes', 'favorites.dish_id', 'dishes.id')
            .where('favorites.user_id', user_id);

        return res.json(userFavorites);
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            await knex("favorites").where({ id }).delete();

            return res.json();

        } catch {
            throw new AppError("Não foi possível remover dos favoritos.", 500);
        }
    }
}

module.exports = FavoritesController