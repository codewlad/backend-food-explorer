const AppError = require("../utils/AppError");

class DishDeleteService {
    constructor(dishRepository) {
        this.dishRepository = dishRepository;
    }

    async execute(id) {
        try {
            await this.dishRepository.deleteDish(id);

            return { message: "Prato excluído com sucesso!" };
        } catch {
            throw new AppError("Não foi possível excluir o prato!", 500);
        };
    };
}

module.exports = DishDeleteService;