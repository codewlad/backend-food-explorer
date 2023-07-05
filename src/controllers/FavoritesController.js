const knex = require("../database/knex");

class FavoritesController {
    async create(req, res) {
        const { user_id, dish_id } = req.body;

        const [checkIfIsFavorite] = await knex("favorites").where("dish_id", dish_id);

        if (checkIfIsFavorite) {
            await knex("favorites").where("id", checkIfIsFavorite.id).delete();
            return res.json({ success: "Removido dos favoritos." });
        }

        await knex("favorites").insert({
            user_id,
            dish_id
        })

        return res.json({ success: "Adicionado aos favoritos." });
    }

    async index(req, res) {
        const { user_id } = req.params;

        const userFavorites = await knex('favorites')
            .select('favorites.id', 'favorites.dish_id', 'dishes.image', 'dishes.name')
            .join('dishes', 'favorites.dish_id', 'dishes.id')
            .where('favorites.user_id', user_id);
        /*
        .then(results => {
            // Manipule os resultados aqui
            console.log(results);
        })
        .catch(error => {
            // Lida com erros aqui
            console.error(error);
        });
        */

        return res.json(userFavorites);
    }
}

module.exports = FavoritesController