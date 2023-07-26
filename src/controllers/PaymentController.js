const PaymentRepository = require("../repositories/PaymentRepository");
const PaymentIndexService = require("../services/PaymentIndexService");

class PaymentController {
    async index(req, res) {
        const { dishIds } = req.query;

        const paymentRepository = new PaymentRepository();

        const paymentIndexService = new PaymentIndexService(paymentRepository);

        const response = await paymentIndexService.execute({ dishIds });

        return res.status(200).json(response);
    };
}

module.exports = PaymentController;