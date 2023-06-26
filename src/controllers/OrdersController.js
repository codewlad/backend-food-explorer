const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class OrdersController {
    async create(req, res) {
        const user_id = req.user.id;
        const { dishes } = req.body;

        let total = 0;
        const dishPrices = {};

        try {
            await knex.transaction(async (trx) => {

                const dishIds = dishes.map((dish) => dish.dish_id);
                const orderItems = await trx("dishes").whereIn("id", dishIds);
                orderItems.forEach((orderItem) => {
                    dishPrices[orderItem.id] = orderItem.price;
                });

                for (const dish of dishes) {
                    const dishPrice = dishPrices[dish.dish_id];
                    const totalDish = dishPrice * dish.amount;
                    total += totalDish;
                }

                const order = {
                    user_id,
                    total,
                    orders_at: new Date().toLocaleString()
                };

                const [order_id] = await trx("orders").insert(order);

                for (const dish of dishes) {
                    const dishPrice = dishPrices[dish.dish_id];
                    const totalItem = dishPrice * dish.amount;

                    const orderItem = {
                        order_id,
                        dish_id: dish.dish_id,
                        amount: dish.amount,
                        total: totalItem,
                    };

                    await trx("order_items").insert(orderItem);
                }
            });

            res.json({ success: true });
        } catch {
            throw new AppError("Ocorreu um erro ao acessar o pedido.", 500);
        }
    }

    async update(req, res) {
        const { order_id } = req.params;
        const { dishes, status } = req.body;

        let total = 0;
        const dishPrices = {};

        try {
            await knex.transaction(async (trx) => {
                const dishIds = dishes.map((dish) => dish.dish_id);
                const orderItems = await trx("dishes").whereIn("id", dishIds);
                orderItems.forEach((orderItem) => {
                    dishPrices[orderItem.id] = orderItem.price;
                });

                await trx("order_items").where("order_id", order_id).delete();

                for (const dish of dishes) {
                    const dishPrice = dishPrices[dish.dish_id];
                    const totalDish = dishPrice * dish.amount;
                    total += totalDish;

                    const orderItem = {
                        order_id,
                        dish_id: dish.dish_id,
                        amount: dish.amount,
                        total: totalDish,
                    };

                    await trx("order_items").insert(orderItem);
                }

                await trx("orders").where("id", order_id).update({
                    total,
                    status,
                    orders_at: new Date().toLocaleString()
                });
            });

            return res.json({ success: true });
        } catch {
            throw new AppError("Ocorreu um erro ao atualizar o pedido.", 500);
        }
    }
}

module.exports = OrdersController;