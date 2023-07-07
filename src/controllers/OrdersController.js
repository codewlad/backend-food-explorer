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

    async index(req, res) {
        const { user_id } = req.params;

        try {
            const order = await knex
                .select('*')
                .from('orders')
                .where('user_id', user_id)
                .andWhere('status', 'aberto')
                .first();

            if (!order) {
                res.json({});
                return;
            }

            const orderItems = await knex('order_items')
                .join('dishes', 'order_items.dish_id', 'dishes.id')
                .where('order_items.order_id', order.id)
                .select('order_items.dish_id', 'dishes.image', 'dishes.name', 'order_items.amount', 'order_items.total');

            const dishes = orderItems.map(item => ({
                dish_id: item.dish_id,
                image: item.image,
                name: item.name,
                amount: item.amount,
                total: item.total
            }));

            const totalAmountResult = await knex('order_items')
                .where('order_id', order.id)
                .sum('amount as totalAmount')
                .first();

            const totalAmount = totalAmountResult.totalAmount || 0;

            const orderWithDishes = { ...order, dishes, totalAmount };

            res.json(orderWithDishes);
        } catch {
            throw new AppError("Ocorreu um erro ao buscar o pedido.", 500);
        }
    }
}

module.exports = OrdersController;