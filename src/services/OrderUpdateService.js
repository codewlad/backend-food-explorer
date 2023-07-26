const AppError = require("../utils/AppError");

class OrderUpdateService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute({ id, status }) {
        try {
            this.orderRepository.update(id, status);

            return { Mensagem: "Status atualizado com sucesso!" };
        } catch {
            throw new AppError("Ocorreu um erro ao atualizar o pedido.", 500);
        };
    };
}

module.exports = OrderUpdateService;