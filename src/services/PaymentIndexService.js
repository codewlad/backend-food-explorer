const AppError = require("../utils/AppError");

class PaymentIndexService {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    async execute({ dishIds }) {
        try {
            if (dishIds.length > 0) {
                const arrayDishIds = dishIds.split(",");

                const filteredDishes = await this.paymentRepository.filterDishes(arrayDishIds);

                return filteredDishes;
            } else {
                return { Mensagem: "Não tem nenhum item adicionado ao pedido." };
            };
        } catch {
            throw new AppError("Não foi possível carregar o pedido.", 500);
        };
    };
}

module.exports = PaymentIndexService;