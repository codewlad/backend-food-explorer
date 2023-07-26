const knex = require("../database/knex");

class PaymentRepository {
    async filterDishes(arrayDishIds) {
        const filteredDishes = await knex("dishes")
            .select("id", "image", "name", "price")
            .whereIn("id", arrayDishIds);

        return filteredDishes;
    };
}

module.exports = PaymentRepository;