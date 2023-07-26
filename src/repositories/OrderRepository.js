const knex = require("../database/knex");

class OrderRepository {
    async filterDishes(dishIds) {
        const orderItems = await knex("dishes").whereIn("id", dishIds);

        return orderItems;
    };

    async createOrder(newOrder) {
        const order = await knex("orders").insert(newOrder);

        return order;
    };

    async createOrderItems(orderItem) {
        await knex("order_items").insert(orderItem);
    };

    async update(id, status) {
        await knex("orders")
            .where("id", id)
            .update({ status });
    };

    async filterOrdersByUserId(id) {
        const ordersById = await knex
            .select("*")
            .from("orders")
            .where("user_id", id)
            .orderBy("orders_at", "desc");

        return ordersById;
    };

    async getOrdersWithDishes(id) {
        const orderItems = await knex("order_items")
            .join("dishes", "order_items.dish_id", "dishes.id")
            .where("order_items.order_id", id)
            .select("order_items.dish_id", "dishes.image", "dishes.name", "order_items.amount", "order_items.total");

        return orderItems;
    };

    async calculateTotalAmount(id) {
        const totalAmountResult = await knex("order_items")
            .where("order_id", id)
            .sum("amount as totalAmount")
            .first();

        return totalAmountResult;
    };

    async showAllOrders() {
        const allOrders = await knex
            .select("*")
            .from("orders")
            .orderBy("orders_at", "desc");

        return allOrders;
    };
}

module.exports = OrderRepository;