const OrderRepository = require("../repositories/OrderRepository");
const OrderCreateService = require("../services/OrderCreateService");
const OrderUpdateService = require("../services/OrderUpdateService");
const OrderIndexService = require("../services/OrderIndexService");
const OrderShowService = require("../services/OrderShowService");

const orderRepository = new OrderRepository();

class OrdersController {
    async create(req, res) {
        const { order } = req.body;

        const orderCreateService = new OrderCreateService(orderRepository);

        const response = await orderCreateService.execute({ order });

        return res.status(201).json(response);
    };

    async update(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        const orderUpdateService = new OrderUpdateService(orderRepository);

        const response = await orderUpdateService.execute({ id, status });

        return res.status(200).json(response);
    };

    async index(req, res) {
        const { user_id } = req.params;

        const orderIndexService = new OrderIndexService(orderRepository);

        const ordersWithDishes = await orderIndexService.execute({ id: user_id });

        return res.status(200).json(ordersWithDishes);
    };

    async show(req, res) {
        const orderShowService = new OrderShowService(orderRepository);

        const ordersWithDishes = await orderShowService.execute();

        return res.status(200).json(ordersWithDishes);
    };
}

module.exports = OrdersController;