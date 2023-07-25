const knex = require("../database/knex");

class FavoritesController {
    async create(req, res) {
        try {
            const { user_id, dish_id } = req.body;

            const [checkIfIsFavorite] = await knex("favorites").where("dish_id", dish_id);

            if (checkIfIsFavorite) {
                await knex("favorites").where("id", checkIfIsFavorite.id).delete();
                return res.json({ Mensagem: "Removido dos favoritos.", favorite: false });
            };

            await knex("favorites").insert({
                user_id,
                dish_id
            });

            return res.status(200).json({ Mensagem: "Adicionado aos favoritos.", favorite: true });
        } catch {
            throw new AppError("Não foi possível adicionar/remover dos favoritos.", 500);
        };
    };

    async index(req, res) {
        try {
            const { user_id } = req.params;

            const userFavorites = await knex("favorites")
                .select("favorites.id", "favorites.dish_id", "dishes.image", "dishes.name")
                .join("dishes", "favorites.dish_id", "dishes.id")
                .where("favorites.user_id", user_id);

            return res.status(200).json(userFavorites);
        } catch {
            throw new AppError("Não foi possível mostrar os favoritos.", 500);
        };
    };

    async delete(req, res) {
        try {
            const { id } = req.params;

            await knex("favorites").where({ id }).delete();

            return res.status(200).json({ Mensagem: "Removido dos favoritos." });

        } catch {
            throw new AppError("Não foi possível remover dos favoritos.", 500);
        };
    };
}

module.exports = FavoritesController