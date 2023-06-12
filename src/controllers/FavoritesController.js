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
}

module.exports = FavoritesController