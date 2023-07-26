const AppError = require("../utils/AppError");

class OrderShowService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute() {
        try {
            const orders = await this.orderRepository.showAllOrders();

            if (!orders || orders.length === 0) {
                return res.json([]);
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

module.exports = OrderShowService;