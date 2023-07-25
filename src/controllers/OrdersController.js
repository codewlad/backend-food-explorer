const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class OrdersController {
    async create(req, res) {
        try {
            const { order } = req.body;

            let total = 0;
            const dishPrices = {};

            await knex.transaction(async (trx) => {
                const dishIds = order.dishes.map((dish) => dish.dish_id);
                const orderItems = await trx("dishes").whereIn("id", dishIds);
                orderItems.forEach((orderItem) => {
                    dishPrices[orderItem.id] = orderItem.price;
                });

                for (const dish of order.dishes) {
                    const dishPrice = dishPrices[dish.dish_id];
                    const totalDish = dishPrice * dish.amount;
                    total += totalDish;
                };

                const newOrder = {
                    user_id: order.user_id,
                    total,
                    orders_at: new Date().toLocaleString(),
                    status: order.status,
                };

                const [order_id] = await trx("orders").insert(newOrder);

                for (const dish of order.dishes) {
                    const dishPrice = dishPrices[dish.dish_id];
                    const totalItem = dishPrice * dish.amount;

                    const orderItem = {
                        order_id,
                        dish_id: dish.dish_id,
                        amount: dish.amount,
                        total: totalItem,
                    };

                    await trx("order_items").insert(orderItem);
                };
            });

            return res.status(201).json({ Mensagem: "Pedido criado com sucesso!" });
        } catch {
            throw new AppError("Ocorreu um erro ao criar o pedido.", 500);
        };
    };

    async update(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            await knex("orders")
                .where("id", id)
                .update({ status });

            return res.status(200).json({ Mensagem: "Status atualizado com sucesso!" });
        } catch {
            throw new AppError("Ocorreu um erro ao atualizar o pedido.", 500);
        };
    };

    async index(req, res) {
        try {
            const { user_id } = req.params;

            const orders = await knex
                .select("*")
                .from("orders")
                .where("user_id", user_id)
                .orderBy("orders_at", "desc");

            if (!orders || orders.length === 0) {
                return res.json([]);
            };

            const ordersWithDishes = [];

            for (const order of orders) {
                const orderItems = await knex("order_items")
                    .join("dishes", "order_items.dish_id", "dishes.id")
                    .where("order_items.order_id", order.id)
                    .select("order_items.dish_id", "dishes.image", "dishes.name", "order_items.amount", "order_items.total");

                const dishes = orderItems.map(item => ({
                    dish_id: item.dish_id,
                    image: item.image,
                    name: item.name,
                    amount: item.amount,
                    total: item.total
                }));

                const totalAmountResult = await knex("order_items")
                    .where("order_id", order.id)
                    .sum("amount as totalAmount")
                    .first();

                const totalAmount = totalAmountResult.totalAmount || 0;

                const orderWithDishes = { ...order, dishes, totalAmount };

                ordersWithDishes.push(orderWithDishes);
            };

            return res.status(200).json(ordersWithDishes);
        } catch {
            throw new AppError("Ocorreu um erro ao buscar os pedidos.", 500);
        };
    };

    async show(req, res) {
        try {
            const orders = await knex
                .select("*")
                .from("orders")
                .orderBy("orders_at", "desc");

            if (!orders || orders.length === 0) {
                return res.json([]);
            };

            const ordersWithDishes = [];

            for (const order of orders) {
                const orderItems = await knex("order_items")
                    .join("dishes", "order_items.dish_id", "dishes.id")
                    .where("order_items.order_id", order.id)
                    .select("order_items.dish_id", "dishes.image", "dishes.name", "order_items.amount", "order_items.total");

                const dishes = orderItems.map(item => ({
                    dish_id: item.dish_id,
                    image: item.image,
                    name: item.name,
                    amount: item.amount,
                    total: item.total
                }));

                const totalAmountResult = await knex("order_items")
                    .where("order_id", order.id)
                    .sum("amount as totalAmount")
                    .first();

                const totalAmount = totalAmountResult.totalAmount || 0;

                const orderWithDishes = { ...order, dishes, totalAmount };

                ordersWithDishes.push(orderWithDishes);
            };

            return res.status(200).json(ordersWithDishes);
        } catch {
            throw new AppError("Ocorreu um erro ao buscar os pedidos.", 500);
        };
    };
}

module.exports = OrdersController;