const AppError = require("../utils/AppError");

class OrderIndexService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute({ id }) {
        try {
            const orders = await this.orderRepository.filterOrdersByUserId(id);

            if (!orders || orders.length === 0) {
                const orderWithDishes = [];
                return orderWithDishes;
            };

            const ordersWithDishes = [];

            for (const order of orders) {
                const orderItems = await this.orderRepository.getOrdersWithDishes(order.id);

                const dishes = orderItems.map(item => ({
                    dish_id: item.dish_id,
                    image: item.image,
                    name: item.name,
                    amount: item.amount,
                    total: item.total
                }));

                const totalAmountResult = await this.orderRepository.calculateTotalAmount(order.id);

                const totalAmount = totalAmountResult.totalAmount || 0;

                const orderWithDishes = { ...order, dishes, totalAmount };

                ordersWithDishes.push(orderWithDishes);
            };

            return ordersWithDishes;
        } catch {
            throw new AppError("Ocorreu um erro ao buscar os pedidos.", 500);
        };
    };
}

module.exports = OrderIndexService;