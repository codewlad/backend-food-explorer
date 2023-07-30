const AppError = require("../utils/AppError");

class OrderCreateService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute({ order }) {
        try {
            let total = 0;
            const dishPrices = {};

            const dishIds = order.dishes.map((dish) => dish.dish_id);

            const orderItems = await this.orderRepository.filterDishes(dishIds);

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
                orders_at: order.orders_at,
                status: order.status
            };

            const [order_id] = await this.orderRepository.createOrder(newOrder);

            for (const dish of order.dishes) {
                const dishPrice = dishPrices[dish.dish_id];
                const totalItem = dishPrice * dish.amount;

                const orderItem = {
                    order_id,
                    dish_id: dish.dish_id,
                    amount: dish.amount,
                    total: totalItem,
                };

                await this.orderRepository.createOrderItems(orderItem);
            };

            return { Mensagem: "Pedido criado com sucesso!" };
        } catch {
            throw new AppError("Ocorreu um erro ao criar o pedido.", 500);
        };
    };
}

module.exports = OrderCreateService;