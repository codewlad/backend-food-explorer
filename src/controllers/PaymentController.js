const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class PaymentController {
    async index(req, res) {
        try {
            const { dishIds } = req.query;

            if (dishIds.length > 0) {
                const arrayDishIds = dishIds.split(",");

                const filteredDishes = await knex("dishes")
                    .select("id", "image", "name", "price")
                    .whereIn("id", arrayDishIds);

                return res.status(200).json(filteredDishes);
            } else {
                return res.status(200).json({ Mensagem: "Não tem nenhum item adicionado ao pedido." });
            };
        } catch {
            throw new AppError("Não foi possível carregar o pedido.", 500);
        };
    };
}

module.exports = PaymentController;